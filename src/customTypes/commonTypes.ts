type GenericNullable<T> = T | null;

type NullableNumber = GenericNullable<number>;
type NullableString = GenericNullable<string>;
type NullableBoolean = GenericNullable<boolean>;

type UndefinableString = string | undefined;

type NumericArray = Array<number>;
type StringArray = Array<string>;
type NullableNumericArray = GenericNullable<NumericArray>;
type NullableStringArray = GenericNullable<StringArray>;

type BasicCallbackType = () => void;

interface iGeoCoordinates {
	latitude: number;
	longitude: number;
}

type PropertyMapping<Source, Target> = {[K in keyof Target]: keyof Source};

type NullableGeoCoordinates = GenericNullable<iGeoCoordinates>;
interface iNormalizedObjectValueBase {
	id: string;
}
interface iNormalizedObjectDetails<T extends iNormalizedObjectValueBase> {
	[key: string]: T;
}

interface iNormalizedObject<T extends iNormalizedObjectValueBase> {
	ids: Array<string>;
	details: iNormalizedObjectDetails<T>;
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
	BasicCallbackType,
	iGeoCoordinates,
	NullableGeoCoordinates,
	PropertyMapping,
	iNormalizedObjectDetails,
	iNormalizedObjectValueBase,
	iNormalizedObject,
};
