import React from 'react'
import styled from 'styled-components'
import { useTable,usePagination,useGlobalFilter} from 'react-table'


const Styles = styled.div`
  padding: 1rem;
  table {
    margin: auto;
    width: 50%;
    background-color: #fff;
    color: #000;
    border-spacing: 0;
    border: 1px solid black;
    

    tr {
      :nth-child(even){background-color: #D1E4F5;}
      :hover {background-color: #00C4F8;}
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }    

    th{
      background-color: #719ABA;
    }
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid white;
      border-right: 1px solid white;      
      :last-child {
        border-right: 0;
      }

    }
  }
  .pagination {
    padding: 0.5rem;
  }
  .contenedor {
    color    : #000;
    text-align:center;
    height: 100%;
  }

`
//background-color: #110C09
// Our table component
function Table({ columns, data }) {
  const props = useTable(
    {
      columns,
      data
    },
    useGlobalFilter, // useGlobalFilter!
    usePagination,
  );
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter }
  } = props;
  console.log(props);
  React.useEffect(() => {
    // props.dispatch({ type: actions.resetPage })
    console.log(globalFilter);
  }, [globalFilter]);

  return (
    <div className='contenedor'>
      {console.log(globalFilter)}
      <label>Buscar</label>          
      <input
        type="text"
        value={globalFilter || ""}
        onChange={e => setGlobalFilter(e.target.value)}
      />
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Pagina{" "}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Ir a la pagina:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                >
                  <span>{column.render('Header')}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()
                      }>{cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div>Se encontraron {rows.length} resultados </div>
      <div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div>     
    </div>
  
  )
}
function AppTable(props) {
    /*const [data ,setData] = useState(props.datos);

    const handleReset = () => {
      setData(props.datos);
      console.log(data);
    };*/
    return (
      <Styles>
        {/*<button onClick={handleReset}>Reset Data</button>*/}        
        <Table columns={props.columnas} data={props.datos} />
      </Styles>
    );
  //}
}

export default AppTable
