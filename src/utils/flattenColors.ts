export function flattenColors(
  colors: Record<string, string>
): Record<string, any> {
  return Object.assign(
    {},
    ...Object.entries(colors ?? {}).flatMap(
      ([color, values]: [color: string, values: any]) => {
        if (typeof values == 'object') {
          return Object.entries(flattenColors(values)).map(
            ([number, hex]: [number: string, hex: any]) => {
              let className = color;
              if (number !== 'DEFAULT') {
                className += `-${number}`;
              }
              return { [className]: hex };
            }
          );
        } else {
          return [{ [color]: values }];
        }
      }
    )
  );
}
