interface I_Prop {
  title: string;
}

const TitleHeader: React.FC<I_Prop> = ({ title }) => {
  return <header className="p-4 border-b">{title}</header>;
};

export default TitleHeader;
