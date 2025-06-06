export type ApiBody =
  | string
  | ArrayBuffer
  | TypedArray
  | DataView
  | Blob
  | File
  | URLSearchParams
  | FormData;

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;
