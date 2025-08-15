export function validateCPF(cpf?: string | null): boolean {
  if (!cpf) return true;

  const cleanCPF = cpf.replace(/\D/g, "");

  if (cleanCPF.length !== 11 || /^(\d)\1+$/.test(cleanCPF)) return false;

  const calcCheckDigit = (cpf: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < factor - 1; i++) {
      total += parseInt(cpf.charAt(i)) * (factor - i);
    }
    const remainder = (total * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const digit1 = calcCheckDigit(cleanCPF, 10);
  const digit2 = calcCheckDigit(cleanCPF, 11);

  return (
    digit1 === parseInt(cleanCPF.charAt(9)) &&
    digit2 === parseInt(cleanCPF.charAt(10))
  );
}

export function formatCPF(cpf: string): string {
  const clean = cpf.replace(/\D/g, "").slice(0, 11);
  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return clean.replace(/^(\d{3})(\d{0,3})/, "$1.$2");
  if (clean.length <= 9)
    return clean.replace(/^(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
  return clean.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
}
