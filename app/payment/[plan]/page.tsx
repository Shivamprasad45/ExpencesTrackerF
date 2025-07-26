interface PageProps {
  params: {
    plan: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { plan } = params;

  return (
    <div>
      <h1>Payment Page</h1>
      <p>Selected Plan: {plan}</p>
    </div>
  );
};

export default Page;
