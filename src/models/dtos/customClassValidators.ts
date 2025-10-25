import { registerDecorator, ValidationArguments } from 'class-validator';

export function MatchPasswords(property: string) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'MatchPasswords',
      target: object.constructor,
      propertyName,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const obj = args?.object;
          const relatedValue = obj[property] as string;
          return relatedValue ? relatedValue === value : false;
        },
        defaultMessage() {
          return `${property} must match ${propertyName}`;
        },
      },
    });
  };
}

export function AtLeastOneFieldIsRequired(properties: string[]) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'atLeastOneFieldIsRequired',
      target: object.constructor,
      propertyName,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const obj = args.object;
          return properties.some((property) => !!obj[property]);
        },
        defaultMessage() {
          return `At least one of the following fields is required: ${properties.join(', ')}`;
        },
      },
    });
  };
}
