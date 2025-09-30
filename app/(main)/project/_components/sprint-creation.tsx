
const SprintCreation = ({
  projectTitle,
  projectKey,
  projectId,
  sprintKey,
}: {
  projectTitle: string;
  projectKey: string;
  projectId: string;
  sprintKey: number;
}) => {
  console.log(projectId, projectTitle, projectKey, sprintKey);
  

  return <div>SprintCreation</div>;
};

export default SprintCreation;
