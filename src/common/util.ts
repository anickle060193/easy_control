export function assertNever( value: never ): never
{
  throw new Error( `Value is not never: ${Object.prototype.toString.call( value )}` );
}
