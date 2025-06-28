type InfoCardProps = {
  name: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
};

const InfoCard = ({ name, value, icon, gradient }: InfoCardProps) => {
  return (
    <div className="gradient-border bg-brand-indigo rounded-xl p-5">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className={`rounded-lg bg-gradient-to-tl p-3 ${gradient}`}>
          {icon}
        </div>
        <div className="flex flex-col items-center text-center">
          <p className="text-sm text-neutral-300">{name}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
