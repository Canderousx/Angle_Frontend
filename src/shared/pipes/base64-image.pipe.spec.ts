import { Base64ImagePipe } from './base64-image.pipe';

describe('Base64ImagePipe', () => {
  it('create an instance', () => {
    const pipe = new Base64ImagePipe();
    expect(pipe).toBeTruthy();
  });
});
