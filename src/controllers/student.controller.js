import {
  response_200,
  response_201,
  response_400,
  response_500,
} from '../utils/responseCodes.js';
import Form from '../models/form.model.js';



export async function newPass(req, res) {
  const {
    name,
    roll,
    sem,
    where,
    purpose,
    transport,
    outtime,
    date,
    ownResponsibility
  } = req.body;

  console.log("recieved")
  if (!name && !roll && !sem && !where && !purpose && transport && !outtime && !date && !ownResponsibility) {
    return response_400(res, 'Some fields are missing!');
  }
console.log("all present")
  let newForm = Form({
    name: name,
    roll: roll,
    sem: sem,
    where: where,
    purpose: purpose,
    transport: transport,
    outtime: outtime,
    date: date,
    ownResponsibility: ownResponsibility
  });
  console.log("newform created")
  try {
    console.log("saving")
    newForm = await newForm.save();
    console.log("saved")
    return response_201(res, 'Outpass request sent successfully!!', {
      name: name,
      roll: roll,
      sem: sem,
      where: where,
      purpose: purpose,
      transport: transport,
      outtime: outtime,
      date: date,
      ownResponsibility: ownResponsibility
    });
  } catch (error) {
    return response_500(res, 'Internal server error', error);
  }

}


export async function pastPasses(req, res) {
  console.log(req.user.roll)
  Form.find({ roll: req.user.roll, role: "Student" })
    .then((finalResult) => {
      console.log(finalResult)
      return response_200(res, 'Fetched all outpasses of current user!!', finalResult);
    }).catch(error => { return response_500(res, 'Internal server error', error); });

}

export async function passStatus(req, res) {

  Form.findOne({}, {}, { sort: { 'created_at': -1 } })
    .then((result) => {
      return response_200(res, 'Fetched status of latest outpass!!', result);
    }).catch(error => { return response_500(res, 'Internal server error', error); });
}
