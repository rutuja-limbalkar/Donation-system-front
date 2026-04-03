import * as React from "react";
import {useState,useEffect}  from 'react';
import DataTable, { createTheme } from "react-data-table-component";
const myNewTheme= {
  rows: {
    style:{
    fontSize: '15px',
    // fontWeight: 'bold'
    }
  },
  headCells: {
    style:{
    fontSize: '15px',
    fontWeight: 'bold'
    }
  }
}

createTheme('standard',{
  text: {
		primary: 'rgba(0, 0, 0, 0.87)',
		secondary: 'rgba(0, 0, 0, 0.54)',
		disabled: 'rgba(0, 0, 0, 0.38)',
	},
	background: {
		default: '#FFFFFF',
	},
	context: {
		background: '#e3f2fd',
		text: 'rgba(0, 0, 0, 0.87)',
	},
	divider: {
		default: 'rgba(0,0,0,.12)',
	},
	button: {
		default: 'rgba(0,0,0,.54)',
		focus: 'rgba(0,0,0,.12)',
		hover: 'rgba(0,0,0,.12)',
		disabled: 'rgba(0, 0, 0, .18)',
	},
	selected: {
		default: '#e3f2fd',
		text: 'rgba(0, 0, 0, 0.87)',
	},
	highlightOnHover: {
		default: '#EEEEEE',
		text: 'rgba(0, 0, 0, 0.87)',
	},
	striped: {
		default: '#FAFAFA',
		text: 'rgba(0, 0, 0, 0.87)',
	},
},'dark');

createTheme('solarized', {
  text: {
    primary: '#268bd2',
    secondary: '#2aa198',
  },
  background: {
    default: '#fff',
  },
  context: {
    background: '#cb4b16',
    text: '#FFFFFF',
  },
  divider: {
    default: '#f0ebeb',
  },
  button: {
		default: 'rgba(0,0,0,.54)',
		focus: 'rgba(0,0,0,.12)',
		hover: 'rgba(0,0,0,.12)',
		disabled: 'rgba(0, 0, 0, .18)',
	},
  action: {
    button: 'rgba(0,0,0,.54)',
    hover: 'rgba(0,0,0,.08)',
    disabled: 'rgba(0,0,0,.12)',
  },
}, 'dark');

function DataTables(props) {
    const columns = props.columns;
    const searchColumn = props.searchColumn
    const tvalue = props.tvalue;
    const [search, setSearch] = useState('');
    const [listData, setListData] = useState(tvalue);
    const [filterData, setFilterData] = useState([]);
    useEffect(() => {
      setListData(tvalue)
      const result = listData.filter((data) => {
        return (data[searchColumn]||'').toLowerCase().match((search||'').toLowerCase());
      });
  
      setFilterData(result);
    }, [search]);
    
    console.log("Data Table ",listData)
    const paginationComponentOptions = {
      selectAllRowsItem: true,
      selectAllRowsItemText: "ALL"
    };

    // const handleChange = (e)=>{
    //   console.log(e)
    // }
  return (
    <div style={{ height: 600, width: "100%" }}>
    <DataTable
      columns={columns}
      id="donationTable"
      data={filterData}
      title={props.title.toUpperCase()}
      theme="solarized"
      pagination={props.pagination}
      paginationComponentOptions={paginationComponentOptions}
      fixedHeader
      customStyles={myNewTheme}
      fixedHeaderScrollHeight="450px"
      highlightOnHover
      // selectableRows
			// onSelectedRowsChange={handleChange}
      // actions={<button className="btn btn-sm btn-info">Export</button>}
      subHeader
      subHeaderComponent={
        <input
          type="text"
          placeholder="Search"
          className="w-25 form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      }
    />
  </div>
//     <div className="table-responsive">
//     <table id="myTable" className="table table-striped">
//     <thead>
//     <tr >
//         {thead.map(head=>(<th>{head}</th>))}
//     </tr>
//     </thead>
//     <tbody>
//         {tvalue.map((value,i)=>(<tr><td>{i+1}</td>{tprops.map(item =>(<td>{value[item]}</td>))}<td><a href={editAction+value.id} data-toggle="tooltip" data-original-title="Edit"> <i className="fa fa-pencil text-inverse m-r-10"></i> </a>
// <a className="hidden" href={deleteAction+value.id} onClick="return confirm('Are you sure you want to delete this Record?')"  data-toggle="tooltip" data-original-title="Cancel"> <i className="fa fa-close text-danger"></i> </a></td></tr>))}
//     </tbody>
//     </table>
//     </div>
  )
}

export default DataTables
