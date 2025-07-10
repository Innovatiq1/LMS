import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from '@core/service/settings.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeComponent  implements OnInit {
  gradeDataset:any[] =[]
  percentagelist:any[] =[] 
  gradeTerm:any[] =[]
  saveButton:boolean = true

  breadscrums = [
    {
      title: 'Passing Criteria',
      items: ['Configuration'],
      active: 'Passing Criteria',
    },
  ];  

  ngOnInit(): void {
    this.percentagelist=[  
  { range: "0-10%" , data:"0-10"},
  { range: "11-20%", data:"11-20"},
  { range: "21-30%", data:"21-30"},
  { range: "31-40%", data:"31-40"},
  { range: "41-50%", data:"41-50"},
  { range: "51-60%", data:"51-60"},
  { range: "61-70%", data:"61-70"},
  { range: "71-80%", data:"71-80"},
  { range: "81-90%", data:"81-90"},
  { range: "91-100%",data:"91-100" }
    ]  

    this.gradeTerm =[ 
      {term:"Excellent"},  
      {term:"Nearly Excellent"}, 
      {term:"Very Good"}, 
      {term:"Good"}, 
      {term:"Fairly Good"}, 
      {term:"Satisfactory"}, 
      {term:"Average"}, 
      {term:"Below Average"}, 
      {term:"Barely Passing"}, 
      {term:"Poor"},
      {term:"Fail"}

    ] 
    this.add_fields() 
    this.add_fields()  
    const getCompanyId:any = localStorage.getItem('userLogs')
    const parseid = JSON.parse(getCompanyId) 
    this.SettingService.gradeFetch(parseid.companyId).subscribe({
      next:(res:any)=>{
       if(res.response != null ){ 
        if(res.response!.gradeList!.length != 0){
        this.gradeDataset.push(...res.response!.gradeList)
        this.patchGrade()
        this.saveButton = false 
        }else{
        this.gradeList.clear()
        this.add_fields()  
        this.saveButton = true
        
        }
       }else{
        this.saveButton = true
       }
      },error:(err)=>{  
        this.gradeList.clear()
        this.add_fields() 
        

      }
    })
   
  }

  constructor(private GradeForms:FormBuilder, private SettingService:SettingsService){}   
 

  GradeFromList = this.GradeForms.group({   
    gradeList: this.GradeForms.array([])

    
  })  

   get gradeList(){
    return this.GradeFromList.get('gradeList') as FormArray
  }  


  
  

add_fields(){ 
  this.gradeList.push(
    this.GradeForms.group({ 
      PercentageRange: ['', Validators.required],
      grade: ['', [Validators.required, Validators.pattern(/^[A-F][+-]?$/i)]], 
      gpa: ['', [Validators.required, Validators.min(0), Validators.max(10)]], 
      gradeTerm: ['',Validators.required], 
    }) 
  )
}


  patchGrade(){ 
    this.gradeList.clear()
    this.gradeDataset.map((data)=>{
       this.gradeList.push(
     this.GradeForms.group({ 
      PercentageRange:[data.PercentageRange,Validators.required],
      grade:[data.grade,[Validators.required, Validators.pattern(/^[A-F][+-]?$/i)]], 
      gpa:[data.gpa,[Validators.required, Validators.min(0), Validators.max(10)]], 
      gradeTerm:[data.gradeTerm,Validators.required], 
    }) 
  )


    })
  }

  SaveGrade(){ 
    if(this.gradeList.valid){
    const payload:any = []  
    this.gradeList.value?.map((data:any)=>data.PercentageRange == "" || data.grade == "" || data.gpa == "" ||data.gradeTerm == "" ? "" : payload.push(data) ) 
    if(payload.length != 0){ 
      const duplicate:any =  this.checkDuplicate(payload)  
      if(duplicate){  
         Swal.fire({
            icon: 'info',
            text: 'Duplicate Record found !',
            timer: 2000,
            showConfirmButton: false
          });
      }else{
      const getCompanyId:any = localStorage.getItem('userLogs')
      const parseid = JSON.parse(getCompanyId) 
      const dataset = { 
      companyId: parseid.companyId,
      gradeList:payload
    } 
    this.SettingService.gradeSave(dataset).subscribe({
      next:(res)=>{ 
         Swal.fire({
            icon: 'success',
            title: 'Added!',
            text: 'Grade has been Added successfully',
            timer: 2000,
            showConfirmButton: false
          });

                   
      this.gradeDataset = []  
      this.gradeDataset.push(...this.gradeList.value)

        this.saveButton = false
      },error:(err)=>{

      }
    })
  }  
} 
} 
} 
updateGrade(){   
if( this.gradeList.valid){
  const payload:any = []  
  this.gradeList.value?.map((data:any)=>data.PercentageRange == "" || data.grade == "" || data.gpa == "" ||data.gradeTerm == "" ? "" : payload.push(data) ) 
  if(payload.length !=0){  
   
       const duplicate:any =  this.checkDuplicate(payload)  
      if(duplicate){  
         Swal.fire({
            icon: 'info',
            text: 'Duplicate Record found !',
            timer: 2000,
            showConfirmButton: false
          });
      } else{
     const getCompanyId:any = localStorage.getItem('userLogs')
      const parseid = JSON.parse(getCompanyId) 
      const dataset = { 
      companyId: parseid.companyId,
      gradeList:payload
    } 
  this.SettingService.gradeUpdate(dataset).subscribe({ 
    next:(res)=>{ 
       Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Grade has been Updated successfully',
            timer: 2000,
            showConfirmButton: false
          });
       
      this.gradeDataset = []  
      this.gradeDataset.push(...this.gradeList.value)
      
    },error:(err)=>{
      console.log(err)

    }

  })

  }
 }
}
} 

removeGrade(index:any){   
  const getDataset = this.gradeList.value[index]
  if(getDataset.PercentageRange != "" &&  getDataset.grade != "" && getDataset.gpa != "" &&getDataset.gradeTerm != "" && this.gradeList.valid &&  this.gradeDataset.length !=0){ 
    Swal.fire({
    title: 'Are you sure?',
    text: `You won't be able to revert this!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result)=>{
    if(result.isConfirmed){
      Swal.fire({
        title: 'Deleting...',
        text: 'Please wait while we delete the grade',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
       this.gradeList.removeAt(index)  
      if(this.gradeList.value.length == 0){  

      const getCompanyId:any = localStorage.getItem('userLogs')
      const parseid = JSON.parse(getCompanyId) 
      const dataset = { 
      companyId: parseid.companyId,
      gradeList:[]
    } 
  this.SettingService.gradeUpdate(dataset).subscribe({ 
    next:(res)=>{ 
       Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Grade has been Updated successfully',
            timer: 2000,
            showConfirmButton: false
          });
      console.log(res) 
      this.saveButton = true 
      this.add_fields() 
    },error:(err)=>{
      console.log(err)

    }

  })

      }else{ 
        const payload:any = []  
  this.gradeList.value?.map((data:any)=>data.PercentageRange == "" || data.grade == "" || data.gpa == "" ||data.gradeTerm == "" ? "" : payload.push(data) ) 
  if(payload.length !=0){
     const getCompanyId:any = localStorage.getItem('userLogs')
      const parseid = JSON.parse(getCompanyId) 
      const dataset = { 
      companyId: parseid.companyId,
      gradeList:payload
    } 
  this.SettingService.gradeUpdate(dataset).subscribe({ 
    next:(res)=>{ 
       Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Grade has been Updated successfully',
            timer: 2000,
            showConfirmButton: false
          });
      console.log(res)
    },error:(err)=>{
      console.log(err)

    }

  })

}  
        
      }
 

    }
  })

  
  }else{
    this.gradeList.removeAt(index)
  }
   

   
 
}
  


checkDuplicate(payload:any):any{  
  
  for (let i = 0; i < payload.length; i++) {
    for (let j = i + 1; j < payload.length; j++) {
      if (
        payload[i].grade == payload[j].grade ||
        payload[i].gpa == payload[j].gpa ||
        payload[i].PercentageRange == payload[j].PercentageRange ||
        payload[i].gradeTerm == payload[j].gradeTerm
      ) { 
        
        return true;  
      }
    }
  } 
  return false  
}
}
