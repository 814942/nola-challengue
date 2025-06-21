import * as bcrypt from 'bcrypt';

export async function isCodeMatching(code: string, hashCode: string) {
  return await bcrypt.compare(code, hashCode);
}