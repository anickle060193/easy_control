export function assertNever( value: never ): never
{
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error( `Value is not never: ${value}` );
}
