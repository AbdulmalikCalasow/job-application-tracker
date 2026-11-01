// Check that an ID contains exactly 24 hexadecimal characters.
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}