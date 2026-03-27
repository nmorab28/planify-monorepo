import React, { Fragment, useReducer } from 'react';
import { Modal, Tab, Nav } from "react-bootstrap";
import {Link} from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';
import { IMAGES } from '../../constant/theme';

const ProgressBar = [
    {title:'Photoshop', percent:'70%', color:'danger'},
    {title:'Code Editor', percent:'85%', color:'info', space:'mt-4'},
    {title:'Illustrator', percent:'65%', color:'success', space:'mt-4'},
];

const detailblog = [
    {title:'Gender', subtitle:'Male'},
    {title:'Education', subtitle:'PHD'},
    {title:'Designation', subtitle:'Sr. Professor'},
    {title:'Operation Done', subtitle:'120'},
];

const socialDetail = [
    {name:'Followers', number:'1204' , title:'Projects', task:'150', border:'border-end'},
    {name:'Following', number:'2540', title:'Uploads', task:'140', border:'border-end'},
    {name:'Friends', number:'2540', title:'Tasks', task:'45'},
];

const initialState = false;
const reducer = (state, action) =>{
	switch (action.type){
		case 'sendMessage':
			return { ...state, sendMessage: !state.sendMessage }		
		case 'postModal':
			return { ...state, post: !state.post }
		case 'linkModal':
			return { ...state, link: !state.link }		
		case 'cameraModal':
			return { ...state, camera: !state.camera }		
		case 'replyModal':
			return { ...state, reply: !state.reply }
		default:
			return state	
	}	
}

const personalDetail = [
    {title:'Name', subtitle:'Mitchell C.Shay'},
    {title:'Email', subtitle:'info@example.com'},
    {title:'Availability', subtitle:'Full Time (Free Lancer)'},
    {title:'Age', subtitle:'27'},
    {title:'Location', subtitle:'Rosemont Avenue Melbourne, Florida'},
    {title:'Year Experience', subtitle:'07 Year Experiences'},
];


function StaffProfile(){
    const [state, dispatch] = useReducer(reducer, initialState);
    return(
        <>
            <div className="row">
                <div className="col-xl-3 col-xxl-4 col-lg-4">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card overflow-hidden">
                                <div className="text-center p-3 overlay-box" style={{backgroundImage: `url(${IMAGES.BigImg1})`}}>
                                    <div className="profile-photo">
                                        <img src={IMAGES.Profile} width="100" className="img-fluid rounded-circle" alt="" />
                                    </div>
                                    <h3 className="mt-3 mb-1 text-white">Deangelo Sena</h3>
                                    <p className="text-white mb-0">Clerk</p>
                                </div>
                                <ul className="list-group list-group-flush">
                                    {socialDetail.map((data, index)=>(
                                        <li className="list-group-item d-flex justify-content-between" key={index}>
                                            <span className="mb-0">{data.name}</span> <strong className="text-muted">{data.number}</strong>
                                        </li>
                                    ))}
                                    
                                </ul>
                                <div className="card-footer text-center border-0 mt-0">								
                                    <Link to={"#"} className="btn btn-primary  px-4 me-1">Follow</Link>
                                    <Link to={"#"} className="btn btn-warning  px-4">Message</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="card overflow-hidden">
                                <div className="card-header">
                                    <h2 className="card-title">about me</h2>
                                </div>
                                <div className="card-body pb-0">
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                    <ul className="list-group list-group-flush">
                                        {detailblog.map((item, ind)=>(
                                            <li className="list-group-item d-flex px-0 justify-content-between" key={ind}>
                                                <strong>{item.title}</strong>
                                                <span className="mb-0">{item.subtitle}</span>
                                            </li>
                                        ))}                                        
                                    </ul>
                                </div>
                                <div className="card-footer pt-0 pb-0 text-center">
                                    <div className="row">
                                        {socialDetail.map((data, i)=>(
                                            <div className={`col-4 pt-3 pb-3 ${data.border}`} key={i}>
                                                <h3 className="mb-1 text-primary">{data.task}</h3>
                                                <span>{data.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header d-block">
                                    <h4 className="card-title">Address </h4>
                                </div>
                                <div className="card-body">
                                    <p className="mb-0">Demo Address #8901 Marmora Road Chi Minh City, Vietnam</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header d-block">
                                    <h4 className="card-title">Work Expertise </h4>
                                </div>
                                <div className="card-body">
                                    {ProgressBar.map((item, ind)=>(
                                        <Fragment key={ind}>
                                            <h6 className={`${item.space}`}>{item.title}
                                                <span className="pull-right">{item.percent}</span>
                                            </h6>
                                            <div className="progress ">
                                                <div className={`progress-bar progress-animated bg-${item.color}`} style={{width: item.percent, height:"6px"}}>
                                                    <span className="sr-only">{item.percent} Complete</span>
                                                </div>
                                            </div>
                                        </Fragment>
                                    ))}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-9 col-xxl-8 col-lg-8">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="profile-tab">
                                        <div className="custom-tab-1">
                                            <Tab.Container defaultActiveKey={"Posts"}>
                                                <Nav as="ul" className="nav nav-tabs">
                                                    <Nav.Item as="li"><Nav.Link eventKey="Posts">Posts</Nav.Link></Nav.Item>
                                                    <Nav.Item as="li"><Nav.Link eventKey="AboutMe">About Me</Nav.Link></Nav.Item>
                                                </Nav>
                                                <Tab.Content className="tab-content">
                                                    <Tab.Pane eventKey={'AboutMe'}>
                                                        <div className="profile-about-me">
                                                            <div className="pt-4 border-bottom-1 pb-4">
                                                                <p>A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence was created for the bliss of souls like mine.I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents.</p>
                                                                <p>A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.</p>
                                                            </div>
                                                        </div>
                                                        <div className="profile-skills pt-2 border-bottom-1 pb-2">
                                                            <h4 className="text-primary mb-4">Skills</h4>
                                                            <Link to={"#"} className="btn btn-outline-dark btn-rounded px-4 me-2 mb-2">Admin</Link>
                                                            <Link to={"#"} className="btn btn-outline-dark btn-rounded px-4 me-2 mb-2">Dashboard</Link>
                                                            <Link to={"#"} className="btn btn-outline-dark btn-rounded px-4 me-2 mb-2">Photoshop</Link>
                                                            <Link to={"#"} className="btn btn-outline-dark btn-rounded px-4 me-2 mb-2">Bootstrap</Link>
                                                            <Link to={"#"} className="btn btn-outline-dark btn-rounded px-4 me-2 mb-2">Responsive</Link>
                                                            <Link to={"#"} className="btn btn-outline-dark btn-rounded px-4 me-2 mb-2">Crypto</Link>
                                                        </div>
                                                        <div className="profile-lang pt-5 border-bottom-1 pb-5">
                                                            <h4 className="text-primary mb-4">Language</h4>
                                                            <span className="badge badge-primary light">English</span>{" "}
                                                            <span className="badge badge-primary light">French</span>{" "}
                                                            <span className="badge badge-primary light">Bangla</span>
                                                        </div>
                                                        <div className="profile-personal-info">
                                                            <h4 className="text-primary mb-4">Personal Information</h4>
                                                            {personalDetail.map((item, ind)=>(
                                                                <div className="row mb-4" key={ind}>
                                                                    <div className="col-lg-3 col-md-4 col-sm-6 col-6">
                                                                        <h5 className="f-w-500">{item.title} <span className="pull-right">:</span></h5>
                                                                    </div>
                                                                    <div className="col-lg-9 col-md-8 col-sm-6 col-6"><span>{item.subtitle}</span></div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Tab.Pane>
                                                    <Tab.Pane eventKey={"Posts"} >
                                                        <div className="my-post-content pt-3">
                                                            <div className="post-input">
                                                                <textarea name="textarea" id="textarea" cols="30" rows="5" className="form-control bg-transparent"                                                                     
                                                                    defaultValue={'Please type what you want....'}
                                                                />                                                                
                                                                <Link to={"#"} className="btn btn-primary light me-1 px-3"
                                                                    onClick={() => dispatch({type:'linkModal'})}
                                                                >
                                                                    <i className="fa fa-link m-0" />
                                                                </Link>{" "}
                                                                <Link to={"#"} className="btn btn-primary light me-1 px-3" onClick={() => dispatch({type:'cameraModal'})}
                                                                >
                                                                    <i className="fa fa-camera m-0" />
                                                                </Link>{" "}    
                                                                <Link to={"#"} className="btn btn-primary" 
                                                                    onClick={() => dispatch({type:'postModal'})}
                                                                >
                                                                    Post
                                                                </Link>                                                                
                                                            </div>
                                                            <div className="profile-uoloaded-post border-bottom-1 pb-5">
                                                                <img src={IMAGES.Profile8} alt="" className="img-fluid w-100 rounded" />
                                                                <Link to={"/post-details"} className="post-title">
                                                                    <h3>"Embark on a Journey of Unparalleled Excellence, Where Innovation and Elegance Converge to Shape Tomorrow's World."</h3>
                                                                </Link>
                                                                <p>A wonderful serenity has take possession of my entire soul like these sweet morning of spare which enjoy whole heart.A wonderful serenity has take possession of my entire soul like these sweet morning
                                                                    of spare which enjoy whole heart.</p>
                                                                <button className="btn btn-primary me-2"><span className="me-2"><i className="fa fa-heart" /></span>Like</button>
                                                                <button className="btn btn-secondary"
                                                                    onClick={()=> dispatch({type:"replyModal"})}
                                                                >
                                                                    <span className="me-2"><i className="fa fa-reply" /></span>Reply
                                                                </button>
                                                            </div>
                                                            <div className="profile-uoloaded-post border-bottom-1 pb-5">
                                                                <img src={IMAGES.Profile9} alt="" className="img-fluid w-100 rounded" />
                                                                <Link to={"/post-details"} className="post-title"><h3>Collection of textile samples lay spread</h3></Link>
                                                                <p>A wonderful serenity has take possession of my entire soul like these sweet morning of spare which enjoy whole heart.A wonderful serenity has take possession of my entire soul like these sweet morning
                                                                    of spare which enjoy whole heart.</p>
                                                                <button className="btn btn-primary me-2"><span className="me-2"><i className="fa fa-heart" /></span>Like</button>
                                                                <button className="btn btn-secondary"  onClick={()=> dispatch({type:"replyModal"})}><span className="me-2">
                                                                    <i className="fa fa-reply" /></span>Reply
                                                                </button>
                                                            </div>
                                                            <div className="profile-uoloaded-post pb-3">
                                                                <img src={IMAGES.Profile10} alt="" className="img-fluid w-100 rounded" />
                                                                <Link to={"/post-details"} className="post-title"><h3>"Breakthrough Study Reveals Promising New Treatment Strategy for Alzheimer's Disease</h3></Link>
                                                                <p>A wonderful serenity has take possession of my entire soul like these sweet morning of spare which enjoy whole heart.A wonderful serenity has take possession of my entire soul like these sweet morning
                                                                    of spare which enjoy whole heart.</p>
                                                                <button className="btn btn-primary me-2"><span className="me-2">
                                                                    <i className="fa fa-heart" /></span>Like
                                                                </button>
                                                                <button className="btn btn-secondary"   onClick={()=> dispatch({type:"replyModal"})}>
                                                                    <span className="me-2"><i className="fa fa-reply"></i></span>Reply
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </Tab.Pane>
                                                </Tab.Content>
                                            </Tab.Container>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* All Model ------ */}
            {/* Camera Model */}
            <Modal show={state.camera} onHide={() => dispatch({type:'cameraModal'})} centered>     
                <div className="modal-header">
                    <h5 className="modal-title">Upload images</h5>
                    <button type="button" className="btn-close" onClick={() => dispatch({type:'cameraModal'})}></button>
                </div>
                <div className="modal-body">
                    <div className="input-group mb-3">
                        <span className="input-group-text">Upload</span>
                        <div className="form-file">
                            <input type="file" className="form-file-input form-control  border-s-1" />
                        </div>
                    </div>
                </div>
            </Modal>
            {/* Social Modal */}
            <Modal className="post-input"  show={state.link} onHide={() => dispatch({type:'linkModal'})} centered>   
                <div className="modal-header">
                    <h5 className="modal-title">Social Links</h5>
                    <button type="button" className="btn-close" onClick={() => dispatch({type:'linkModal'})}></button>
                </div>
                <div className="modal-body">
                    <Link to={"#"} className="btn-social me-1 facebook mb-1"><i className="fab fa-facebook-f"/></Link>
                    <Link to={"#"} className="btn-social me-1 google-plus mb-1"><i className="fab fa-google-plus-g"/></Link>
                    <Link to={"#"} className="btn-social me-1 linkedin mb-1"><i className="fab fa-linkedin"/></Link>
                    <Link to={"#"} className="btn-social me-1 instagram mb-1"><i className="fab fa-instagram"/></Link>
                    <Link to={"#"} className="btn-social me-1 twitter mb-1"><i className="fab fa-twitter"/></Link>
                    <Link to={"#"} className="btn-social me-1 youtube mb-1"><i className="fab fa-youtube"/></Link>
                    <Link to={"#"} className="btn-social whatsapp mb-1"><i className="fab fa-whatsapp"/></Link>
                </div>
            </Modal>

            {/* Post Modal */}
            <Modal className="post-input" show={state.post} onHide={()=>dispatch({type:'postModal'})} centered> 
                <div className="modal-header">
                    <h5 className="modal-title">Post</h5>
                    <button type="button" className="btn-close" onClick={() => dispatch({type:'postModal'})}></button>
                </div>
                <div className="modal-body">
                    <textarea name="textarea" id="textarea2" cols="30" rows="3" className="form-control bg-transparent" 
                        defaultValue={'Please type what you want....'}                            
                    />
                    <Link to={"#"} className="btn btn-primary">Post</Link>		 
                </div>
            </Modal>
            {/* Reply Modal */}
            <Modal className="modal fade" id="replyModal" show={state.reply}  onHide={()=>dispatch({type:'replyModal'})} centered> 
                <div className="modal-header">
                    <h5 className="modal-title">Post Reply</h5>
                    <button type="button" className="btn-close"  onClick={() => dispatch({type:'replyModal'})}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <textarea className="form-control" rows="4" defaultValue={'Message'} />
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger light" onClick={() => dispatch({type:'replyModal'})}>Close</button>
                    <button type="button" className="btn btn-primary">Reply</button>
                </div>
            </Modal>
        </>
    )
}

const ProfileStaff = () => {
    
    return (
        <>
            <PageTitle activeMenu="Staff Profile" motherMenu={"Staff"} />
            <StaffProfile />
        </>
    )
};

export {StaffProfile};
export default ProfileStaff;