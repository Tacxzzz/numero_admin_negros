declare module "*.svg" {
    const content: string;
    export default content;
  }

  declare namespace Intl {
    interface SegmenterOptions {
      granularity?: 'grapheme' | 'word' | 'sentence';
    }
  
    class Segmenter {
      constructor(locale?: string | string[], options?: SegmenterOptions);
      segment(input: string): Iterable<{ segment: string; index: number; input: string }>;
    }
  }