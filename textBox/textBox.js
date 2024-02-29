import { LightningElement } from 'lwc';
export default class TextBox extends LightningElement {

    myValue = 'public class AttendanceMarkScreenController{@AuraEnabled public Static LightningResponse getDailyVisitData(String userId,String recordId){try{List<Daily_Visit_Plan__c> dailyVisitPlan=new List<Daily_Visit_Plan__c>();Map<String,Object> bindVariable=new Map<String,Object>();String query=\'Select id,User__c,CreatedDate,Start_Day__c,Approval_Status__c,Leave_Type__c,End_Day__c,Visit_Date__c From Daily_Visit_Plan__c where User__c=:userId0 AND Visit_Date__c=:todayDate0 \';if(String.isNotBlank(recordId)){query+=\' AND Id=:recordId0 limit 1\';bindVariable.put(\'recordId0\',recordId);}else{query+=\' limit 1\';}bindVariable.put(\'todayDate0\',System.today());bindVariable.put(\'userId0\',userId);dailyVisitPlan=Database.queryWithBinds(query,bindVariable,AccessLevel.USER_MODE);if(dailyVisitPlan.isEmpty()){String queryPJP=\'SELECT Id, From_Date__c, To_Date__c FROM PJP__c WHERE From_Date__c<=:todayDate0 AND To_Date__c>=:todayDate0\';List<PJP__c> pjpList=Database.queryWithBinds(queryPJP,bindVariable,AccessLevel.USER_MODE);Daily_Visit_Plan__c dv=new Daily_Visit_Plan__c();dv.Visit_Date__c=system.today();dv.Team__c=UserInfo.getName();dv.User__c=UserInfo.getUserId();if(pjpList.isEmpty()){PJP__c pjprecord=new PJP__c();Date today=System.today();Integer dayOfWeek=Integer.valueOf(DateTime.newInstance(today.year(),today.month(),today.day()).format(\'u\'));Integer daysToSubtract=Math.mod(dayOfWeek-1+7,7);Date previousMonday=today.addDays(-daysToSubtract);pjprecord.From_Date__c=previousMonday;pjprecord.To_Date__c=previousMonday.addDays(6);pjprecord.User__c=UserInfo.getUserId();pjprecord.Name=UserInfo.getName()+\'(\'+previousMonday+\')\';pjprecord.PJP_Type__c=\'Weekly\';insert pjprecord;dv.PJP__c=pjprecord.Id;}else{dv.PJP__c=pjpList[0].id;}insert dv;List<Daily_Visit_Plan__c> dvList=new List<Daily_Visit_Plan__c>();dvList.add(dv);LightningResponse response=new LightningResponse(true,dv.Id,dvList,\'Success\',true,\'Start Day\',true,false,true);return response;}else{if(!dailyVisitPlan[0].Start_Day__c&&String.isBlank(dailyVisitPlan[0].Leave_Type__c)){LightningResponse response=new LightningResponse(true,dailyVisitPlan[0].Id,dailyVisitPlan,\'Success\',true,\'Start Day\',true,false,true);return response;}else if(String.isNotBlank(dailyVisitPlan[0].Leave_Type__c)){LightningResponse response=new LightningResponse(true,dailyVisitPlan[0].Id,dailyVisitPlan,\'Leave marked successfully!\',false,\'\',false,false,false);return response;}else if(dailyVisitPlan[0].Start_Day__c&&dailyVisitPlan[0].End_Day__c){LightningResponse response=new LightningResponse(true,dailyVisitPlan[0].Id,dailyVisitPlan,\'Visit Done...\',false,\'\',false,false,false);return response;}else{LightningResponse response=new LightningResponse(true,dailyVisitPlan[0].Id,dailyVisitPlan,\'Success\',true,\'End Day\',false,true,false);return response;}}}catch(Exception ex){LightningResponse response=new LightningResponse(false,\'\',null,ex.getMessage(),false,\'\',false,false,false);return response;}}@AuraEnabled public static void updateEndDayData(String latitude,String longitude,String dailyPlanId,String comment){try{List<Daily_Visit_Plan__c> dailyVisitPlan=new List<Daily_Visit_Plan__c>();Map<String,Object> bindVariable=new Map<String,Object>();String query=\'Select id,User__c,CreatedDate,Start_Day__c,Leave_Type__c,End_Day__c From Daily_Visit_Plan__c where Id=:Id0 Limit 1\';bindVariable.put(\'Id0\',dailyPlanId);dailyVisitPlan=Database.queryWithBinds(query,bindVariable,AccessLevel.USER_MODE);if(!dailyVisitPlan.isEmpty()){dailyVisitPlan[0].End_Day__c=true;dailyVisitPlan[0].Check_out_Location__Latitude__s=Decimal.valueOf(latitude);dailyVisitPlan[0].Check_out_Location__Longitude__s=Decimal.valueOf(longitude);dailyVisitPlan[0].Check_Out__c=System.now();dailyVisitPlan[0].Comment__c=comment;Update dailyVisitPlan[0];}else{CalloutException e=new CalloutException();e.setMessage(\'No daily plan found for update check out\');throw e;}}catch(Exception ex){CalloutException e=new CalloutException();e.setMessage(ex.getMessage());throw e;}}@AuraEnabled public static void uploadFileAndUpdateCheckIn(String base64,String filename,String recordId,String latitude,String longitude,String picklistData){try{List<Daily_Visit_Plan__c> dailyVisitPlan=new List<Daily_Visit_Plan__c>();Map<String,Object> bindVariable=new Map<String,Object>();String query=\'Select id,User__c,CreatedDate,Start_Day__c,Present_Type__c,Leave_Type__c,End_Day__c From Daily_Visit_Plan__c where Id=:Id0 Limit 1\';bindVariable.put(\'Id0\',recordId);dailyVisitPlan=Database.queryWithBinds(query,bindVariable,AccessLevel.USER_MODE);if(!dailyVisitPlan.isEmpty()){dailyVisitPlan[0].Start_Day__c=true;dailyVisitPlan[0].CheckIn_Location__Latitude__s=Decimal.valueOf(latitude);dailyVisitPlan[0].CheckIn_Location__Longitude__s=Decimal.valueOf(longitude);dailyVisitPlan[0].Check_In__c=System.now();dailyVisitPlan[0].Present_Type__c=picklistData;dailyVisitPlan[0].Type__c=\'Present\';dailyVisitPlan[0].Attendance_Date__c=system.today();Update dailyVisitPlan[0];}else{CalloutException e=new CalloutException();e.setMessage(\'No daily plan found for update check in details\');throw e;}}}public class LightningResponse{@AuraEnabled public boolean isSuccessError{get;set;}@AuraEnabled public String dailyPlanId{get;set;}@AuraEnabled public List<Daily_Visit_Plan__c> dailyVisitPlanData{get;set;}@AuraEnabled public String message{get;set;}@AuraEnabled public boolean isSuccess{get;set;}@AuraEnabled public String buttonLabel{get;set;}@AuraEnabled public Boolean showStartButton{get;set;}@AuraEnabled public Boolean showEndButton{get;set;}@AuraEnabled public Boolean showLeaveButton{get;set;}public LightningResponse(Boolean isSuccessErrorP,String dailyPlanIdP,List<Daily_Visit_Plan__c> dailyVisitPlanDataP,String messageP,Boolean isSuccessP,String buttonLabelP,Boolean showStartButtonP,Boolean showEndButtonP,Boolean showLeaveButtonP){isSuccessError=isSuccessErrorP;dailyPlanId=dailyPlanIdP;dailyVisitPlanData=dailyVisitPlanDataP;message=messageP;isSuccess=isSuccessP;buttonLabel=buttonLabelP;showStartButton=showStartButtonP;showEndButton=showEndButtonP;showLeaveButton=showLeaveButtonP;}}';

    myVal ;
    diabledTrue = true;
    finalValue='';
    countOpenBracket=0;
    loopTimes=0;

    connectedCallback() {
        console.log('Here 1');
        this.processString();
        console.log(this.finalValue);
    }

    processString(){
        try{
            console.log('Here 2');
            for(let i=0;i<this.myValue.length;i++){
                if(this.myValue[i]=='{'){
                    this.countOpenBracket++;
                    this.finalValue+='{';
                    this.finalValue+='\n';
                    for(let j=0;j<this.countOpenBracket;j++){
                        this.finalValue+='\t';
                    }
                }else if(this.myValue[i]==';'){
                    this.finalValue+=';';
                    this.finalValue+='\n';
                    this.loopTimes=this.countOpenBracket;
                    if(this.myValue[i+1]=='}'){
                        this.loopTimes--;
                    }
                    for(let j=0;j<this.loopTimes;j++){
                        this.finalValue+='\t';
                    }
                }else if(this.myValue[i]=='}'){
                    this.finalValue+='}';
                    this.finalValue+='\n';
                    this.countOpenBracket--;
                    if(this.myValue[i+1]=='}'){
                        for(let j=0;j<this.countOpenBracket-1;j++){
                            this.finalValue+='\t';
                        }
                    }else{
                        for(let j=0;j<this.countOpenBracket;j++){
                            this.finalValue+='\t';
                        }
                    }
                }
                else{
                    this.finalValue+=this.myValue[i];
                }
            }
            this.myVal = '<pre>'+this.finalValue+'</pre>';
        }catch(e){
            console.log('Error-->>',e.message);
        }
    }

}