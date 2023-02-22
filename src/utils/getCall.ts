export const getCalls = (
  address: string,
  callAbi: string,
  labelName: string,
) => {
  return [
    {
      target: address,
      call: [callAbi],
      label: labelName,
    },
  ]
}
