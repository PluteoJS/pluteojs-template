import {
	PropertyMapping,
	iNormalizedObject,
	iNormalizedObjectDetails,
	iNormalizedObjectValueBase,
} from "@customTypes/commonTypes";

/**
 * Converts properties from one object to another.
 * @param source - source object
 * @param mapping - mapping of source properties to target properties
 * @returns - target object
 */
function convertProperties<SourceType, TargetType>(
	source: SourceType,
	mapping: PropertyMapping<SourceType, TargetType>
): TargetType {
	const result = {} as TargetType;

	Object.keys(mapping).forEach((targetKey) => {
		const sourceKey = mapping[targetKey as keyof TargetType];

		const value: unknown = source[sourceKey as keyof SourceType];

		result[targetKey as keyof TargetType] =
			value as TargetType[keyof TargetType];
	});

	return result;
}

/**
 * Normalizes array of objects into object with ids and details.
 * Returns object with ids and details.
 * @param objectArray - array of objects
 * @returns - normalized object
 * @example normalizeArrayOfObjects([{id: "1", name: "John"}, {id: "2", name: "Jane"}])
 * returns {ids: ["1", "2"], details: {"1": {id: "1", name: "John"}, "2": {id: "2", name: "Jane"}}}
 * // This is useful when you want to return an array of objects from a service method,
 * // but you also want to return an array of ids for the client to use.
 */
function normalizeArrayOfObjects<
	SourceType extends iNormalizedObjectValueBase,
	TargetType extends iNormalizedObjectValueBase
>(
	objectArray: SourceType[],
	propertyMap: PropertyMapping<SourceType, TargetType>
): iNormalizedObject<TargetType> {
	const ids: string[] = [];
	const details: iNormalizedObjectDetails<TargetType> = {};

	objectArray.forEach((object) => {
		const key = object.id;

		ids.push(key);

		details[key] = convertProperties<SourceType, TargetType>(
			object,
			propertyMap
		);
	});

	return {ids, details};
}

export default {normalizeArrayOfObjects, convertProperties};
