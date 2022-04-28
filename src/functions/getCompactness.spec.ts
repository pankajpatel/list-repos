import constants from '../constants';
import { getCompactness } from './getCompactness';

describe('getCompactness()', () => {
  describe('-c', () => {
    it('should return NONE when flag is not used', () => {
      expect(getCompactness({})).toBe(constants.COMPACTNESS_LEVELS.NONE);
    });
    it('should return LOW when flag is used without value', () => {
      expect(getCompactness({ c: true })).toBe(
        constants.COMPACTNESS_LEVELS.LOW
      );
    });
    it('should return MEDIUM when flag is used with value `s`', () => {
      expect(getCompactness({ c: 's' })).toBe(
        constants.COMPACTNESS_LEVELS.MEDIUM
      );
    });
    it('should return HIGH when flag is used with value `so`', () => {
      expect(getCompactness({ c: 'so' })).toBe(
        constants.COMPACTNESS_LEVELS.HIGH
      );
    });
  });
  describe('--compact', () => {
    it('should return NONE when flag is not used', () => {
      expect(getCompactness({})).toBe(constants.COMPACTNESS_LEVELS.NONE);
    });
    it('should return LOW when flag is used without value', () => {
      expect(getCompactness({ compact: true })).toBe(
        constants.COMPACTNESS_LEVELS.LOW
      );
    });
    it('should return MEDIUM when flag is used with value `s`', () => {
      expect(getCompactness({ compact: 's' })).toBe(
        constants.COMPACTNESS_LEVELS.MEDIUM
      );
    });
    it('should return HIGH when flag is used with value `so`', () => {
      expect(getCompactness({ compact: 'so' })).toBe(
        constants.COMPACTNESS_LEVELS.HIGH
      );
    });
  });
});
