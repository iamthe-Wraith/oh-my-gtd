import { Service, type IServiceProps } from "./service";
import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";
import { MAX_FEATURE_FLAG_DESCRIPTION_LENGTH, MAX_FEATURE_FLAG_NAME_LENGTH } from "$lib/constants/feature-flag";
import slugify from "slugify";
import { UserRole } from "../../types/user";

export interface ICreateFeatureFlagRequest {
    name: string;
    description?: string;
    isEnabled: boolean;
}

export interface IUpdateFeatureFlagRequest {
    id: number;
    name: string;
    description?: string | null;
    isEnabled: boolean;
}

export class FeatureFlagService extends Service {
    constructor(props: IServiceProps) {
        super(props);
    }

    public static isValidFeatureFlagRequest = (featureFlag: ICreateFeatureFlagRequest) => {
        const errors: ApiError[] = [];
    
        if (featureFlag.name) {
            if (featureFlag.name.length > MAX_FEATURE_FLAG_NAME_LENGTH) {
                errors.push(new ApiError(`NAME must be less than ${MAX_FEATURE_FLAG_NAME_LENGTH} characters.`, HttpStatus.UNPROCESSABLE, 'name'));
            }
        } else {
            errors.push(new ApiError('Title is required.', HttpStatus.UNPROCESSABLE, 'title'));
        }

        if (featureFlag.description && featureFlag.description.length > MAX_FEATURE_FLAG_DESCRIPTION_LENGTH) {
            errors.push(new ApiError(`Description must be less than ${MAX_FEATURE_FLAG_DESCRIPTION_LENGTH} characters.`, HttpStatus.UNPROCESSABLE, 'description'));
        }
    
        if (featureFlag.isEnabled !== undefined && typeof featureFlag.isEnabled !== 'boolean') {
            errors.push(new ApiError('Invalid isEnabled value received.', HttpStatus.UNPROCESSABLE, 'isEnabled'));
        }
    
        return errors;
    };

    /**
     * Check if the user is authorized to perform the action. If not, throw an error.
     */
    public authorize = () => {
        if (
            !this.user ||
            !this.user.role ||
            (
                this.user.role !== UserRole.ADMIN &&
                this.user.role !== UserRole.SUPER_ADMIN
            )
        ) {
            throw new ApiError('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    public create = async ({ name, description, isEnabled }: ICreateFeatureFlagRequest) => {
        this.authorize();

        const validationErrors = FeatureFlagService.isValidFeatureFlagRequest({ name, description, isEnabled });
        if (validationErrors.length) throw validationErrors;

        const existingFeatureFlag = await this.transaction(async (tx) => tx.featureFlag.findUnique({
            where: { name },
        }));

        if (existingFeatureFlag) {
            throw new ApiError('Feature flag with this name already exists.', HttpStatus.CONFLICT);
        }

        const slug = this.slugify(name);

        return this.transaction(async (tx) => tx.featureFlag.create({
            data: {
                name,
                slug,
                description,
                isEnabled,
                updatedBy: this.user.id,
            },
        }));
    };

    public delete = async (id: number) => {
        this.authorize();

        return this.transaction(async (tx) => tx.featureFlag.delete({
            where: { id },
        }));
    }

    public getById = async (id: number) => {
        this.authorize();

        return this.transaction(async (tx) => tx.featureFlag.findUnique({
            where: { id },
        }));
    };

    public getAll = () => {
        return this.transaction(async (tx) => {
            return tx.featureFlag.findMany({
                orderBy: [ { name: 'asc' } ],
            });
        });
    };

    public update = async ({ id, name, description, isEnabled }: IUpdateFeatureFlagRequest) => {
        this.authorize();

        const validationErrors = FeatureFlagService.isValidFeatureFlagRequest({ name, description: description ?? undefined, isEnabled });
        if (validationErrors.length) throw validationErrors;

        const existingFeatureFlag = await this.transaction(async (tx) => tx.featureFlag.findUnique({
            where: { id },
        }));
        
        if (!existingFeatureFlag) {
            throw new ApiError('Feature flag not found.', HttpStatus.NOT_FOUND);
        }

        if (existingFeatureFlag.name !== name) {
            const existingFeatureFlagWithNewName = await this.transaction(async (tx) => tx.featureFlag.findUnique({
                where: { name },
            }));

            if (existingFeatureFlagWithNewName) {
                throw new ApiError('Feature flag with this name already exists.', HttpStatus.CONFLICT);
            }
        }

        const slug = this.slugify(name);

        return this.transaction(async (tx) => tx.featureFlag.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                isEnabled,
                updatedBy: this.user.id,
            },
        }));
    }

    private slugify = (name: string) => {
        return slugify(name, {
            lower: true,
            strict: true,
        });
    }
}