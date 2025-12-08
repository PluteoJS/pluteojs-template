import {
	iNormalizedObject,
	iNormalizedObjectValueBase,
} from "@/customTypes/CommonTypes";

/**
 * Utility function that returns a copy of the object after removing all the properties
 * that have been set to either `undefined` or `null`.
 * @param obj - The object to clean.
 * @returns A cleaned object without any `undefined` or `null` properties.
 */
function cleanObject<T extends object>(obj: T): Partial<T> {
	const result = {} as Partial<T>; // This type assertion informs TypeScript about the nature of 'result'.

	// Here we're checking that each key is actually a key of 'T', which TypeScript enforces for safety.
	Object.keys(obj).forEach((key) => {
		const propertyKey = key as keyof T; // This type assertion allows TypeScript to validate the following line.

		if (typeof obj[propertyKey] !== "undefined" && obj[propertyKey] !== null) {
			result[propertyKey] = obj[propertyKey];
		}
	});

	return result;
}

function deleteProps<SourceType extends object, TargetType extends object>(
	obj: SourceType,
	keysToBeDeleted: (keyof SourceType)[]
): TargetType {
	// Create a shallow copy of the object, as we don't want to modify the original object.
	const newObj = {...obj};

	// Iterate over each key we want to delete.
	keysToBeDeleted.forEach((key) => {
		// Delete each specified key from the new object.
		// We're not checking whether the object actually contains the key as the 'delete' operation
		// will simply do nothing if the key is not present. This is a JavaScript standard behavior.
		delete newObj[key];
	});

	// Return the new object, explicitly asserting the type as 'TargetType'.
	// This assertion informs TypeScript that we know what we're doing and that we claim the new object
	// will adhere to the structure of 'TargetType'.
	return newObj as unknown as TargetType;
}

/**
 * Checks if the value is undefined or not and returns true if it is undefined
 * otherwise returns false.
 * @param value - The value to check.
 * @returns True if the value is undefined, otherwise false.
 */
function isUndefined(value: unknown): boolean {
	return typeof value === "undefined";
}

/**
 * Sorts the ids of a normalized object based on the concatenated values of specified keys.
 *
 * @template T - The type of the items in the normalized object, extending `iNormalizedObjectValueBase`.
 * @template K - The keys of the items in the normalized object.
 *
 * @param {iNormalizedObject<T>} normalizedObject - The normalized object containing `ids` and `details`.
 * @param {K[]} sortKeys - An array of keys to sort by. The sorting will be based on the concatenated values of these keys.
 * @param {"ASC" | "DESC"} [order="ASC"] - The sort order, either "ASC" for ascending or "DESC" for descending.
 * @returns {Array<string>} The sorted array of ids.
 *
 * @example
 * interface ExampleItem extends iNormalizedObjectValueBase {
 *   name: string;
 *   age: number;
 *   city: string;
 * }
 *
 * const exampleNormalizedObject: iNormalizedObject<ExampleItem> = {
 *   ids: ['1', '2', '3'],
 *   details: {
 *     '1': { id: '1', name: 'John', age: 30, city: 'New York' },
 *     '2': { id: '2', name: 'Alice', age: 25, city: 'Los Angeles' },
 *     '3': { id: '3', name: 'Bob', age: 28, city: 'Chicago' },
 *   },
 * };
 *
 * const sortKeys: (keyof ExampleItem)[] = ['name', 'age'];
 * const sortOrder = 'ASC';
 *
 * const sortedIds = sortIdsByKeys(exampleNormalizedObject, sortKeys, sortOrder);
 * console.log(sortedIds); // Output: [ '2', '3', '1' ]
 */
function sortIdsByKeys<T extends iNormalizedObjectValueBase, K extends keyof T>(
	normalizedObject: iNormalizedObject<T>,
	sortKeys: K[],
	order: "ASC" | "DESC" = "ASC"
): Array<string> {
	const {ids, items} = normalizedObject;

	// Sort the ids array based on the concatenated values of the sort keys
	const sortedIds = ids.sort((idA, idB) => {
		let concatenatedValueA = "";
		let concatenatedValueB = "";

		const itemA = items[idA];
		const itemB = items[idB];

		// Concatenate values of each key in sortKeys for both idA and idB
		for (const key of sortKeys) {
			concatenatedValueA += String(itemA?.[key] ?? "");
			concatenatedValueB += String(itemB?.[key] ?? "");
		}

		// Compare the concatenated values based on the specified order
		if (order === "ASC") {
			return concatenatedValueA.localeCompare(concatenatedValueB);
		} else {
			return concatenatedValueB.localeCompare(concatenatedValueA);
		}
	});

	return sortedIds;
}

const hashObjectUtil = {
	cleanObject,
	deleteProps,
	isUndefined,
	sortIdsByKeys,
};

export default hashObjectUtil;
