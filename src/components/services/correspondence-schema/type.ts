export interface SegmentType {
  segmentType: string;
  segmentKey: string;
  order: string;
  value: string;
  sequenceNumberLength: number;
}

export interface CorrespondenceSchemaType {
  id: number;
  segmentType: string;
  segments: SegmentType[];
}
