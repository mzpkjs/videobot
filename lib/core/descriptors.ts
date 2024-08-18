import { Option } from "#/core/options"


export enum DescriptorType {
  NAME = "NAME",
  DESCRIPTION = "DESCRIPTION",
  OPTIONS = "OPTIONS"
}

export type Descriptor<TValue> = {
  type: DescriptorType
  value: TValue
}

export const name = (text: string): Descriptor<string> => {
  return {
    type: DescriptorType.NAME,
    value: text
  }
}

export const description = (text: string): Descriptor<string> => {
  return {
    type: DescriptorType.DESCRIPTION,
    value: text
  }
}

export const options = (...options: Option<unknown>[]): Descriptor<Option<unknown>[]> => {
  return {
    type: DescriptorType.OPTIONS,
    value: options
  }
}
