import React from "react";

const Organisation = ({ params }: { params: { organisationId: string } }) => {

  const { organisationId } = params;

  return <div>Organisation: {organisationId} </div>;
};

export default Organisation;
