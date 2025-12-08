type GenericNullable<T> = T | null;

type NullableNumber = GenericNullable<number>;
type NullableString = GenericNullable<string>;
type NullableBoolean = GenericNullable<boolean>;

type UndefinableString = string | undefined;

type NumericArray = Array<number>;
type StringArray = Array<string>;
type NullableNumericArray = GenericNullable<NumericArray>;
type NullableStringArray = GenericNullable<StringArray>;

type ComponentIdType = string | undefined;

type BasicCallbackType = () => void;

// We will define custom type for color later
type ColorValue = string;

interface iGeoCoordinates {
	latitude: number;
	longitude: number;
}

type PropertyMapping<Source, Target> = {[K in keyof Target]: keyof Source};

type NullableGeoCoordinates = GenericNullable<iGeoCoordinates>;

/**
 * Base interface for objects with an id.
 * All objects extending this interface must have an id property of type string.
 */
interface iNormalizedObjectValueBase {
	/**
	 * Unique identifier for the object.
	 */
	id: string;
}

/**
 * Dictionary interface for details where keys are strings and values are of type T.
 * T must extend iNormalizedObjectValueBase, ensuring the values will always have an id property.
 *
 * @template T - Type extending iNormalizedObjectValueBase.
 */
interface iNormalizedObjectDetails<T extends iNormalizedObjectValueBase> {
	/**
	 * Dictionary of details where each key is a string (typically an id) and each value is of type T.
	 */
	[key: string]: T;
}

/**
 * Normalized object interface with ids array and details dictionary.
 *
 * @template T - Type extending iNormalizedObjectValueBase.
 *
 * Example usage:
 * ```
 * interface iUser extends iNormalizedObjectValueBase {
 *     name: string;
 *     email: string;
 * }
 *
 * const users: iNormalizedObject<iUser> = {
 *     ids: ['user1', 'user2'],
 *     details: {
 *         user1: {
 *             id: 'user1',
 *             name: 'John Doe',
 *             email: 'john.doe@example.com'
 *         },
 *         user2: {
 *             id: 'user2',
 *             name: 'Jane Smith',
 *             email: 'jane.smith@example.com'
 *         }
 *     }
 * };
 * ```
 */
interface iNormalizedObject<T extends iNormalizedObjectValueBase> {
	/**
	 * Array of strings representing the ids of the objects.
	 */
	ids: Array<string>;

	/**
	 * Object where each key is a string (an id) and each value is of type T.
	 */
	items: iNormalizedObjectDetails<T>;
}

export type {
	GenericNullable,
	NullableNumber,
	NullableString,
	NullableBoolean,
	UndefinableString,
	NumericArray,
	StringArray,
	NullableNumericArray,
	NullableStringArray,
	ComponentIdType,
	BasicCallbackType,
	ColorValue,
	iGeoCoordinates,
	NullableGeoCoordinates,
	PropertyMapping,
	iNormalizedObjectDetails,
	iNormalizedObjectValueBase,
	iNormalizedObject,
};
