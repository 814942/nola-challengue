import { registerDecorator, ValidationArguments } from 'class-validator';

export function PasswordRules() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'password',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any) {
          if (!value) return false;

          // TODO: set minLength to 8 and every required field to true for prod
          const minLength = 6;
          const maxLength = 50;
          const requireUppercase = false;
          const requireLowercase = false;
          const requireNumber = false;
          const requireSpecialChar = false;

          // Construir la expresión regular basada en las opciones
          let regexParts: string[] = [];

          if (requireNumber) regexParts.push('(?=.*\\d)');
          if (requireSpecialChar) regexParts.push('(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\|,.<>/?])');
          if (requireUppercase) regexParts.push('(?=.*[A-Z])');
          if (requireLowercase) regexParts.push('(?=.*[a-z])');

          const regex = new RegExp(`^(?:${regexParts.join('')}).{${minLength},${maxLength}}$`);

          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          const minLength = 8;
          const maxLength = 50;
          const requireUppercase = true;
          const requireLowercase = true;
          const requireNumber = true;
          const requireSpecialChar = true;

          const requirements: string[] = [];
          if (requireUppercase) requirements.push('una mayúscula');
          if (requireLowercase) requirements.push('una minúscula');
          if (requireNumber) requirements.push('un número');
          if (requireSpecialChar) requirements.push('un caracter especial');

          const requirementsText = requirements.join(', ').replace(/, ([^,]+)$/, ' y $1');

          return `La contraseña debe tener entre ${minLength} y ${maxLength} caracteres y ${requirementsText}.`;
        },
      },
    });
  };
}
