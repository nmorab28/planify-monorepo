import React, {useState, useRef, useEffect} from 'react';
import { Dropdown } from 'react-bootstrap';
import {Link} from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';

const feeTabale = [
    { id:5,roll:'01', name:'Tiger Nixon', number:'#54605', type:'Library', payment:'Cash', status:'Paid', color:'success', date:'2024/01/02', amount:'120',},
    { id:4,roll:'02', name:'Garrett Winters', number:'#5423', type:'Library', payment:'Cheque', status:'Pending', color:'warning', date:'2024/01/01', amount:'125',},
    { id:3,roll:'03', name:'Ashton Cox', number:'#5412', type:'Tuition', payment:'Credit Card', status:'Unpaid', color:'danger', date:'2024/01/03', amount:'110',},
    { id:2,roll:'04', name:'Cedric Kelly', number:'#5236', type:'Annual', payment:'Cheque', status:'Paid', color:'success', date:'2024/01/04', amount:'105',},
    { id:1,roll:'05', name:'Airi Satou', number:'#4123', type:'Tuition', payment:'Credit Card', status:'Pending', color:'warning', date:'2024/01/02', amount:'115',},
    { id:8,roll:'06', name:'Brielle Williamson', number:'#3251', type:'Library', payment:'Cash', status:'Unpaid', color:'danger', date:'2024/01/01',amount:'140',},
    { id:6,roll:'07', name:'Herrod Chandler', number:'#2541', type:'Annual', payment:'Credit Card',status:'Paid', color:'success',date:'2024/01/04',  amount:'125',},
    { id:7,roll:'08', name:'Rhona Davidson', number:'#8541', type:'Tuition', payment:'Cheque', status:'Pending', color:'warning', date:'2024/01/03', amount:'104',},
    { id:9,roll:'09', name:'Colleen Hurst', number:'#3254', type:'Library', payment:'Cash', status:'Unpaid', color:'danger', date:'2024/01/01', amount:'110',},
    { id:10,roll:'10', name:'Sonya Frost', number:'#7412', type:'Annual', payment:'Credit Card', status:'Paid', color:'success', date:'2024/01/03', amount:'115',},    
    { id:12,roll:'11', name:'Airi Satou', number:'#4123', type:'Tuition', payment:'Credit Card', status:'Pending', color:'warning', date:'2024/01/02', amount:'115',},
    { id:11,roll:'12', name:'Brielle Williamson', number:'#3251', type:'Library', payment:'Cash', status:'Unpaid', color:'danger', date:'2024/01/01',amount:'140',},
    { id:14,roll:'13', name:'Herrod Chandler', number:'#1123', type:'Annual', payment:'Credit Card',status:'Paid', color:'success',date:'2024/01/04',  amount:'125',},
    { id:13,roll:'14', name:'Rhona Davidson', number:'#1251', type:'Tuition', payment:'Cheque', status:'Pending', color:'warning', date:'2024/01/03', amount:'104',},
    { id:15,roll:'15', name:'Brielle Williamson', number:'#7415', type:'Library', payment:'Cash', status:'Unpaid', color:'danger', date:'2024/01/01',amount:'140',},
    { id:17,roll:'16', name:'Herrod Chandler', number:'#1001', type:'Annual', payment:'Credit Card',status:'Paid', color:'success',date:'2024/01/04',  amount:'125',},
    { id:16,roll:'17', name:'Rhona Davidson', number:'#1141', type:'Tuition', payment:'Cheque', status:'Pending', color:'warning', date:'2024/01/03', amount:'104',},
    { id:19,roll:'18', name:'Colleen Hurst', number:'#2221', type:'Library', payment:'Cash', status:'Unpaid', color:'danger', date:'2024/01/01', amount:'110',},
    { id:18,roll:'19', name:'Sonya Frost', number:'#4441', type:'Annual', payment:'Credit Card', status:'Paid', color:'success', date:'2024/01/03', amount:'115',},    
    { id:21,roll:'20', name:'Airi Satou', number:'#4122', type:'Tuition', payment:'Credit Card', status:'Pending', color:'warning', date:'2024/01/02', amount:'115',},
    { id:20,roll:'21', name:'Brielle Williamson', number:'#7411', type:'Library', payment:'Cash', status:'Unpaid', color:'danger', date:'2024/01/01',amount:'140',},
    { id:22,roll:'22', name:'Herrod Chandler', number:'#9874', type:'Annual', payment:'Credit Card',status:'Paid', color:'success',date:'2024/01/04',  amount:'125',},
    { id:25,roll:'23', name:'Tiger Nixon', number:'#54605', type:'Library', payment:'Cash', status:'Paid', color:'success', date:'2024/01/02', amount:'120',},
    { id:24,roll:'24', name:'Garrett Winters', number:'#5423', type:'Library', payment:'Cheque', status:'Pending', color:'warning', date:'2024/01/01', amount:'125',},
    { id:26,roll:'25', name:'Cox Ashton', number:'#5412', type:'Tuition', payment:'Credit Card', status:'Unpaid', color:'danger', date:'2024/01/03', amount:'110',},
    { id:23,roll:'26', name:'Kelly Cedric', number:'#5236', type:'Annual', payment:'Cheque', status:'Paid', color:'success', date:'2024/01/04', amount:'105',},
];

const theadData = [
    {heading: 'Roll No', sortingVale:"roll"},
    {heading: 'Student Name', sortingVale:"name"},
    {heading: 'Invoice Number', sortingVale:"number"},
    {heading: 'Fees Type', sortingVale:"type"},
    {heading: 'Payment Type', sortingVale:"payment"},
    {heading: 'Status', sortingVale:"status"},
    {heading: 'Date', sortingVale:"date"},
    {heading: 'Amount', sortingVale:"amount"}
];


const FeeCollection = () => {
    const [sort, setSortata] = useState(10);
    const [data, setData] = useState(
        document.querySelectorAll('#feeList tbody tr')
    )
    //   const sort = 10
    const activePag = useRef(0)
    const [test, settest] = useState(0)
    
      // Active data
    const chageData = (frist, sec) => {
        for (var i = 0; i < data.length; ++i) {
          if (i >= frist && i < sec) {
            data[i].classList.remove('d-none')
          } else {
            data[i].classList.add('d-none')
          }
        }
    }
      
    useEffect(() => {
        setData(document.querySelectorAll('#feeList tbody tr'))        
    }, [test])
    
      
    activePag.current === 0 && chageData(0, sort)

      // paggination
    let paggination = Array(Math.ceil(data.length / sort))
        .fill()
        .map((_, i) => i + 1)
    
      
    const onClick = (i) => {
        activePag.current = i
        chageData(activePag.current * sort, (activePag.current + 1) * sort)
        settest(i)
    }
      
    const [feeData, setFeeDate] = useState([...feeTabale]);
    const [iconData, setIconDate] = useState({ complete: false ,ind : Number});


    function SotingData(name){
        const sortedPeople = [...feeData]; 
        switch (name) {
            case "roll":
                sortedPeople.sort((a, b) => {
                return   a.roll < b.roll ? -1 : 1 });
            break;
            case "name":
                sortedPeople.sort((a, b) => {                    
                 return  iconData.complete ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)                    
                });
             break;
            case "number":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.number.localeCompare(b.number) : b.type.localeCompare(a.number)                    
                });
             break;
            case "type":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)                    
                });
             break;
        
            default:
                break;
        }            
        setFeeDate(sortedPeople);         
    }    
    function DataSearch(e){        
        const updatesDate =  feeTabale.filter(item =>{
            let selectdata = `${item.name} ${item.payment} ${item.type} ${item.status}`.toLowerCase();       
            return  selectdata.includes(e.target.value.toLowerCase())
        });        
        setFeeDate([...updatesDate])        
    }

    return (
        <>
            <PageTitle activeMenu={"Fees Collection"} motherMenu={"Fees"}/>   
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Fees Collection</h4>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <div id='feeList' className='dataTables_wrapper no-footer'>
                                    <div className='justify-content-between d-sm-flex'>                                    
                                        <div className='dataTables_length'>
                                            <label className='d-flex align-items-center'>
                                                Show
                                                <Dropdown className='search-drop'>
                                                    <Dropdown.Toggle as="div" className="search-drop-btn">
                                                        {sort}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={()=>setSortata('10')}>10</Dropdown.Item>
                                                        <Dropdown.Item onClick={()=>setSortata('20')}>20</Dropdown.Item>
                                                        <Dropdown.Item onClick={()=>setSortata('30')}>30</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                entries
                                            </label>
                                        </div>
                                        <div className="dataTables_filter">
                                            <label>Search : <input type="search" className="" placeholder="" 
                                                    onChange={DataSearch}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <table id="example4" className="display dataTable no-footer w-100" >
                                        <thead>
                                            <tr>                                                
                                                {theadData.map((item, ind)=>(
                                                    <th key={ind}
                                                        onClick={()=>{SotingData(item.sortingVale); setIconDate(prevState => ({complete:!prevState.complete, ind: ind }) )}}
                                                    >{item.heading}
                                                        <span>
                                                            {ind !== iconData.ind &&
                                                                <i className="fa fa-sort ms-2 fs-12" style={{opacity: '0.3'}} />                                                                
                                                            }
                                                            {ind === iconData.ind && (
                                                                iconData.complete ? 
                                                                    <i className="fa fa-arrow-down ms-2 fs-12"  style={{opacity: '0.7'}} />
                                                                    :
                                                                    <i className="fa fa-arrow-up ms-2 fs-12" style={{opacity: '0.7'}} />                                                                    
                                                                )                                                            
                                                            }
                                                        </span>
                                                    </th>
                                                ))}                                               
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {feeData.map((data, ind)=>(
                                                <tr key={ind}>
                                                    <td>{data.roll}</td>
                                                    <td>{data.name}</td>
                                                    <td>{data.number}</td>
                                                    <td>{data.type}</td>
                                                    <td>{data.payment}</td>
                                                    <td><span className={`badge badge-${data.color}`}>{data.status}</span></td>
                                                    <td>{data.date}</td>
                                                    <td><strong>{data.amount}$</strong></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className='d-sm-flex text-center justify-content-between align-items-center mt-3'>
                                        <div className='dataTables_info'>
                                            Showing {activePag.current * sort + 1} to{' '}
                                            {data.length > (activePag.current + 1) * sort
                                                ? (activePag.current + 1) * sort
                                                : data.length}{' '}
                                            of {data.length} entries
                                        </div>
                                        <div
                                            className='dataTables_paginate paging_simple_numbers'
                                            id='example5_paginate'
                                        >
                                            <Link
                                                className='paginate_button previous disabled'
                                                to='#'
                                                onClick={() =>
                                                    activePag.current > 0 && onClick(activePag.current - 1)
                                                }
                                            >
                                                
                                                Previous
                                            </Link>
                                            <span>
                                                {paggination.map((number, i) => (
                                                    <Link
                                                        key={i}
                                                        to='#'
                                                        className={`paginate_button  ${
                                                            activePag.current === i ? 'current' : ''
                                                        } `}
                                                        onClick={() => onClick(i)}
                                                    >
                                                        {number}
                                                    </Link>
                                                ))}
                                            </span>
                                            <Link
                                                className='paginate_button next'
                                                to='#'
                                                onClick={() =>
                                                    activePag.current + 1 < paggination.length &&
                                                    onClick(activePag.current + 1)
                                                }
                                            >
                                                
                                                Next
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>                            
        </>
    );
};

export default FeeCollection;