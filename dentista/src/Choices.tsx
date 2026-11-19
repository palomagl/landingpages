// Grupo de opções em "pílulas", feito com rádios de verdade (teclado e leitor de tela funcionam).
export function Choices<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="choices">
      <legend>{legend}</legend>
      <div className="pills">
        {options.map((o) => (
          <label key={o.id} className={`pill ${value === o.id ? "on" : ""}`}>
            <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
