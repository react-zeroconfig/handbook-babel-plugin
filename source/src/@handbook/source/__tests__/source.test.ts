import { source } from '@handbook/source';

describe('@handbook/source', () => {
  test('should get content', () => {
    // Arrange
    const sourceModule = {
      module: {},
      source: '',
      filename: '',
    };

    const dynamicSourceModule = {
      module: () => Promise.resolve({}),
      source: '',
      filename: '',
    };

    // Assert
    expect(source(sourceModule)).toBe(sourceModule);
    expect(source(dynamicSourceModule)).toBe(dynamicSourceModule);
  });

  test('should throw error', () => {
    // Assert
    expect(() => source({})).toThrow();
    expect(() => source({})).toThrow();
  });
});
