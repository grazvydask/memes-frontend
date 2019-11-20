import * as React from 'react'

interface ResultInterface {
  resultContainerRef: React.RefObject<any>;
}

// Result component
const Result = (props: ResultInterface) => {
  return (
    <div ref={props.resultContainerRef} className="d-flex justify-content-center align-items-center"></div>
  )
}

export default Result
