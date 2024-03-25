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

  if (!name && !roll && !sem && !where && !purpose && transport && !outtime && !date && !ownResponsibility) {
    return response_400(res, 'Some fields are missing!');
  }
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
  try {
    newForm = await newForm.save();
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
  // console.log(req.user)
  const email = req.user.email;
  const roll = email.slice(0,10);
  Form.find({ roll: roll })
    .then((finalResult) => {
      // console.log(finalResult)
      return response_200(res, 'Fetched all outpasses of current user!!', finalResult);
    }).catch(error => { return response_500(res, 'Internal server error', error); });

}

export async function passStatus(req, res) {

  Form.findOne({}, {}, { sort: { 'created_at': -1 } })
    .then((result) => {
      return response_200(res, 'Fetched status of latest outpass!!', result);
    }).catch(error => { return response_500(res, 'Internal server error', error); });
}
