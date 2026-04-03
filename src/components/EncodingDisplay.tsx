import type { InstrType } from '../data/types';

interface Props {
  encoding: string;  // e.g. "0000000 00011 00010 000 00001 0110011"
  type: InstrType;
}

interface Field {
  label: string;
  bits: string;
  color: string;      // Tailwind bg class
  textColor: string;  // Tailwind text class
}

function parseFields(encoding: string, type: InstrType): Field[] {
  // Remove spaces to get 32-bit string
  const bits = encoding.replace(/\s/g, '');

  if (type === 'R') {
    // funct7(7) | rs2(5) | rs1(5) | funct3(3) | rd(5) | opcode(7)
    return [
      { label: 'funct7', bits: bits.slice(0, 7),  color: 'bg-amber-100',  textColor: 'text-amber-800' },
      { label: 'rs2',    bits: bits.slice(7, 12), color: 'bg-orange-100', textColor: 'text-orange-800' },
      { label: 'rs1',    bits: bits.slice(12,17), color: 'bg-blue-100',   textColor: 'text-blue-800' },
      { label: 'funct3', bits: bits.slice(17,20), color: 'bg-purple-100', textColor: 'text-purple-800' },
      { label: 'rd',     bits: bits.slice(20,25), color: 'bg-green-100',  textColor: 'text-green-800' },
      { label: 'opcode', bits: bits.slice(25,32), color: 'bg-slate-100',  textColor: 'text-slate-700' },
    ];
  } else if (type === 'I') {
    // imm[11:0](12) | rs1(5) | funct3(3) | rd(5) | opcode(7)
    return [
      { label: 'imm[11:0]', bits: bits.slice(0, 12), color: 'bg-rose-100',   textColor: 'text-rose-800' },
      { label: 'rs1',       bits: bits.slice(12,17), color: 'bg-blue-100',   textColor: 'text-blue-800' },
      { label: 'funct3',    bits: bits.slice(17,20), color: 'bg-purple-100', textColor: 'text-purple-800' },
      { label: 'rd',        bits: bits.slice(20,25), color: 'bg-green-100',  textColor: 'text-green-800' },
      { label: 'opcode',    bits: bits.slice(25,32), color: 'bg-slate-100',  textColor: 'text-slate-700' },
    ];
  } else if (type === 'S') {
    // imm[11:5](7) | rs2(5) | rs1(5) | funct3(3) | imm[4:0](5) | opcode(7)
    return [
      { label: 'imm[11:5]', bits: bits.slice(0, 7),  color: 'bg-rose-100',   textColor: 'text-rose-800' },
      { label: 'rs2',       bits: bits.slice(7, 12), color: 'bg-orange-100', textColor: 'text-orange-800' },
      { label: 'rs1',       bits: bits.slice(12,17), color: 'bg-blue-100',   textColor: 'text-blue-800' },
      { label: 'funct3',    bits: bits.slice(17,20), color: 'bg-purple-100', textColor: 'text-purple-800' },
      { label: 'imm[4:0]',  bits: bits.slice(20,25), color: 'bg-rose-100',   textColor: 'text-rose-800' },
      { label: 'opcode',    bits: bits.slice(25,32), color: 'bg-slate-100',  textColor: 'text-slate-700' },
    ];
  } else {
    // B: imm[12,10:5](7) | rs2(5) | rs1(5) | funct3(3) | imm[4:1,11](5) | opcode(7)
    return [
      { label: 'imm[12,10:5]', bits: bits.slice(0, 7),  color: 'bg-rose-100',   textColor: 'text-rose-800' },
      { label: 'rs2',          bits: bits.slice(7, 12), color: 'bg-orange-100', textColor: 'text-orange-800' },
      { label: 'rs1',          bits: bits.slice(12,17), color: 'bg-blue-100',   textColor: 'text-blue-800' },
      { label: 'funct3',       bits: bits.slice(17,20), color: 'bg-purple-100', textColor: 'text-purple-800' },
      { label: 'imm[4:1,11]',  bits: bits.slice(20,25), color: 'bg-rose-100',   textColor: 'text-rose-800' },
      { label: 'opcode',       bits: bits.slice(25,32), color: 'bg-slate-100',  textColor: 'text-slate-700' },
    ];
  }
}

export default function EncodingDisplay({ encoding, type }: Props) {
  const fields = parseFields(encoding, type);
  return (
    <div className="flex items-end gap-0.5">
      {fields.map((f) => (
        <div key={f.label} className="flex flex-col items-center gap-0.5">
          <span className={`text-[9px] font-mono ${f.textColor} whitespace-nowrap`}>{f.label}</span>
          <div className={`flex gap-px ${f.color} rounded px-0.5 py-0.5`}>
            {f.bits.split('').map((bit, i) => (
              <span key={i} className={`text-[10px] font-mono font-semibold ${f.textColor} leading-none`}>{bit}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
