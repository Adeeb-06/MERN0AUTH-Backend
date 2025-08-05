/** Problem -01 ( Divide the Asset ) */
var area = 800;
//write your code here
var karimsArea = area * 0.5;
var rahimsArea = area - karimsArea;
console.log("Karim's area: " + karimsArea);
console.log("Rahim's area: " + rahimsArea);


/** Problem -02 ( Cycle or Laptop ) */
var money = 10000;
//write your code here
if(money >= 25000){
  console.log('Montu can have a laptop');
} else if(money >= 10000){
  console.log('Montu can have a cycle');
} else{
  console.log('Montu can have a chocolate');
}


/** Problem -03 ( Medicine Planner ) */
var lastDay = 11 ;
//write your code here

for(var day = 1 ; day <= lastDay ; day++){
  if(day % 3 === 0){
    console.log('day ' + day + ' - medicine')
  }else{
    console.log('day ' + day + ' - rest')
  }
}


/** Problem 04 - (Delete / Store) */
var fileName= "pdfData.jpf";
//write your code here
if(fileName.startsWith('#') || fileName.endsWith('.docx') || fileName.endsWith('.pdf') ) {
  console.log('Store');
}else{
  console.log('Delete');
}


/** Problem 05 - ( PH Email Generator )  */
var student= { name: "jhankar" , roll: 1014 ,department: "cse" };
//write your code here
var email = `${student.name}${student.roll}.${student.department}@ph.ac.bd`;
console.log(email);

/** Problem 06 :  (Current Salary )  */
var experience = 30;
var startingSalary = 45000;
//write your code here
var currentSalary = startingSalary + (experience * 0.05 * startingSalary);
console.log(currentSalary);