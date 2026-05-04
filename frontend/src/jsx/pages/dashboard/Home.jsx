import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { SparklinesBars, SparklinesLine, Sparklines } from 'react-sparklines';

import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';

//Import Components
import { BgCard } from '../../elements/CardDesign';
import { IMAGES } from '../../constant/theme';
import CkEditorBlog from '../../elements/CkEditor/CkEditorBlog';

//Charts
const SurveyChart = loadable(() => pMinDelay(import('../../elements/dashboard/SurveyChart'), 500));
const DonughtChart = loadable(() =>
  pMinDelay(import('../../elements/dashboard/DonughtChart'), 500)
);
const University = loadable(() => pMinDelay(import('../../elements/dashboard/University'), 500));

const bgCarddBlog = [
  {
    title: 'Total Students',
    number: '3180',
    icon: <i className="la la-users" />,
    percent: '80%',
    color: 'primary',
  },
  {
    title: 'New Students',
    number: '360',
    icon: <i className="la la-user" />,
    percent: '50%',
    color: 'warning',
  },
  {
    title: 'Total Course',
    number: '28',
    icon: <i className="la la-graduation-cap" />,
    percent: '60%',
    color: 'secondary',
  },
  {
    title: 'Fees Collection',
    number: '1290$',
    icon: <i className="la la-dollar" />,
    percent: '35%',
    color: 'danger',
  },
];

const detailCard = [
  {
    title: 'When Is the Best Time to Take an Education Course?',
    name: 'Jack Ronan',
    image: IMAGES.course1,
  },
  {
    title: 'Education Courses: A Guide to Unlocking Your Potential',
    name: 'Jimmy Morris',
    image: IMAGES.course2,
  },
  {
    title: 'A Comprehensive Guide to Taking an Education Course',
    name: 'Konne Backfield',
    image: IMAGES.course3,
  },
  {
    title: 'Why Should You Consider Taking an Education Course?',
    name: 'Nashid Martines',
    image: IMAGES.course4,
  },
];

const examTable = [
  { roll: '542', name: ' Jack Ronan' },
  { roll: '360', name: 'Jimmy Morris' },
  { roll: '450', name: 'Samantha' },
  { roll: '296', name: 'Roman Aurora' },
  { roll: '520', name: 'Nashid Martines' },
  { roll: '620', name: 'Daigno' },
];

const tabelData = [
  {
    no: '01',
    name: 'Jack Ronan',
    proff: 'Airi Satou',
    date: '02 jan 2024',
    status: 'Checkin',
    color: 'primary',
    subject: 'Commerce',
    fees: '120',
  },
  {
    no: '02',
    name: 'Jimmy Morris',
    proff: 'Angelica Ramos',
    date: '02 jan 2024',
    status: 'Pending',
    color: 'warning',
    subject: 'Mechanical',
    fees: '205',
  },
  {
    no: '03',
    name: 'Nashid Martines',
    proff: 'Ashton Cox',
    date: '04 jan 2024',
    status: 'Canceled',
    color: 'danger',
    subject: 'Science',
    fees: '180',
  },
  {
    no: '04',
    name: 'Roman Aurora',
    proff: 'Cara Stevens',
    date: '05 jan 2024',
    status: 'Process',
    color: 'info',
    subject: 'Arts',
    fees: '200',
  },
  {
    no: '05',
    name: 'Samantha',
    proff: 'Bruno Nash',
    date: '06 jan 2024',
    status: 'Checkin',
    color: 'primary',
    subject: 'Maths',
    fees: '210',
  },
];

const Home = () => {
  return (
    <>
      <Row>
        {bgCarddBlog.map((item, index) => (
          <Col xl={'3'} xxl={'3'} sm={'6'} key={index}>
            <div className={`widget-stat card bg-${item.color}`}>
              <div className="card-body">
                <BgCard
                  title={item.title}
                  number={item.number}
                  percent={item.percent}
                  color={item.color}
                  icon={item.icon}
                />
              </div>
            </div>
          </Col>
        ))}
        <Col xl={'6'} xxl={'6'} lg={'12'} sm={'12'}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">University Survey</h3>
            </div>
            <div className="card-body">
              <SurveyChart />
            </div>
          </div>
        </Col>
        <Col xl={'3'} xxl={'3'} sm={'6'}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Donught Chart</h3>
            </div>
            <div className="card-body">
              <DonughtChart />
            </div>
          </div>
        </Col>
        <Col xl={'3'} xxl={'3'} sm={'6'}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">University Survey</h3>
            </div>
            <div className="card-body">
              <University />
            </div>
          </div>
        </Col>
        {/* {detailCard.map((item, ind)=>(
					<Col xl={"3"} md={"6"} key={ind}>
						<div className="card">
							<img className="img-fluid rounded-top" src={item.image} alt="" />
							<div className="card-body">
								<h4><Link to={"/about-courses"}>{item.title}</Link></h4>
								<ul className="list-group mb-3 list-group-flush">
									<li className="list-group-item px-0 border-top-0 d-flex justify-content-between"><span className="mb-0">April 23</span>
										<Link to={"#"} className="add-wishlist-btn">
											<i className="la la-heart-o outline" />
											<i className="la la-heart fill" />
											<span>450</span>
										</Link>
									</li>
									<li className="list-group-item px-0 d-flex justify-content-between">
										<span className="mb-0">Duration :</span><strong>12 Months</strong>
									</li>
									<li className="list-group-item px-0 d-flex justify-content-between">
										<span className="mb-0">Professor :</span><strong>{item.name}</strong>
									</li>
									<li className="list-group-item px-0 d-flex justify-content-between">
										<span><i className="fa fa-graduation-cap text-primary me-2" />Student</span><strong>+120</strong>
									</li>
								</ul>
								<Link to={"/about-courses"} className="btn btn-primary">Read More</Link>
							</div>
						</div>
					</Col>
				))}
				<Col lg={"6"}>
					<div className="card">
						<div className="card-body">
							<form action="#" method="post">
								<div className="form-group">
									<div className="input-group mb-3">
										<span className="input-group-text">To</span>
										<input type="text" className="form-control" placeholder="Username" />
									</div>
									<div className="input-group mb-3">
										<span className="input-group-text">Subject</span>
										<input type="text" className="form-control" placeholder="Subject" />
									</div>
								</div>
								<div className="form-group">
									<div className="custom-ekeditor">										
										<CkEditorBlog />
									</div>
								</div>
								<div className="row align-items-center my-3">
									<div className="col-xl-6">
										<div className="mb-xl-0 mb-3">
											<input type="file" className="form-control" data-default-file="" />
										</div>
									</div>
									<div className="col-xl-6 ">
										<button type="submit" className="btn btn-primary float-xl-end">
											Send <i className="fa fa-paper-plane-o" />
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</Col>
				<Col lg={"6"}>
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Exam Toppers</h4>
						</div>
						<div className="card-body">
							<div className="table-responsive">
								<table className="table verticle-middle text-nowrap">
									<thead>
										<tr>
											<th scope="col">Roll No.</th>
											<th scope="col">Name</th>
											<th scope="col">Status</th>
											<th scope="col">Edit</th>
										</tr>
									</thead>
									<tbody>
										{examTable.map((item, ind)=>(
											<tr key={ind}>
												<td>{item.roll}</td>
												<td>{item.name}</td>
												<td>
													<span id="widget_sparklinedash">
														<Sparklines data={[20, 25,28, 30, 34, 38, 45, 50, 52, 55, 58, 60, 64, 68, 72]}>
															{ind % 2 === 0 ? 
																<SparklinesBars style={{ stroke: "white", strokeWidth: "1", fill: "#40c0f5" }} /> 
																:															
																<SparklinesLine color="blue" />
															}
														</Sparklines>
													</span>
												</td>
												<td>													
													<Link to={"#"} className="btn btn-xs sharp btn-primary me-1"><i className="fa fa-pencil" /></Link>
													<Link to={"#"} className="btn btn-xs sharp btn-danger"><i className="fa fa-trash" /></Link>
												</td>
											</tr>
										))}
										
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</Col>
				<Col>
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">New Student List</h4>
						</div>
						<div className="card-body pt-2">
							<div className="table-responsive recentOrderTable">
								<table className="table verticle-middle text-nowrap table-responsive-md">
									<thead>
										<tr>
											<th scope="col">No.</th>
											<th scope="col">Name</th>
											<th scope="col">Assigned Professor</th>
											<th scope="col">Date of Admit</th>
											<th scope="col">Status</th>
											<th scope="col">Subject</th>
											<th scope="col">Fees</th>
											<th scope="col">Edit</th>
										</tr>
									</thead>
									<tbody>
										{tabelData.map((item, index)=>(
											<tr key={index}>
												<td>{item.no}</td>
												<td>{item.name}</td>
												<td>{item.proff}</td>
												<td>{item.date}</td>
												<td><span className={`badge badge-rounded badge-${item.color}`}>{item.status}</span></td>
												<td>{item.subject}</td>
												<td>{item.fees}$</td>
												<td>
													<Link to={"/edit-student"} className="btn btn-xs sharp btn-primary me-1"><i className="fa fa-pencil" /></Link>
													<Link to={"#"} className="btn btn-xs sharp btn-danger"><i className="fa fa-trash" /></Link>
												</td>
											</tr>
										))}

									</tbody>
								</table>
							</div>
						</div>				
					</div>				
				</Col> */}
      </Row>
    </>
  );
};
export default Home;
