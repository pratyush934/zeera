import React from 'react'

const ProjectId = ({ params }: { params: { projectId: string } }) => {
  return (
    <div>ProjectId: {params.projectId}</div>
  )
}

export default ProjectId