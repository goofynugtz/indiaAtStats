
const Table = ({statistics}) => {
  return (
    <div className='table'>
      <div className='table-row'>
        <div className='district-cell heading'>Districts</div>
        <div className='values-cell heading'>Values</div>
      </div>
      <div className='table-data'>
        {statistics.map((data) => (
          <div className='table-row'>
          <div className='district-cell'>{data.District}</div>
          <div className='values-cell'>{data.Average || data.Literacy || data.Population || data.SexRatio}</div>
          </div>))}
      </div>
    </div>
  )
}

export default Table