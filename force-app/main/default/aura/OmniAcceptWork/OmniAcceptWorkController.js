({
	doInit : function(component, event, helper) {
		
        console.log('Running doInit');
        
        /* Fetch User Info */
        helper.fetchUserInfo(component);
        
        /* Fetch User Status */
        helper.fetchUserStatus(component);      
       		 
		/* Fetch Cases */
        helper.fetchCases(component);
        
        /* Get Current Workload */
        helper.getWorkload(component);
        
        /* Fetch Online Omni Channel Status Options */
        var action = component.get("c.getOnlinePresenceStatus");       
                       
        action.setCallback(this, function(response){
            	var state = response.getState();
                if (component.isValid() && state === "SUCCESS"){
                    
                  component.set("v.omniStatusList", response.getReturnValue());
                  /*console.log(response.getReturnValue());*/
                }
                else {
                  console.log("Failed with state" + state);
                }
          })
          $A.enqueueAction(action);
        
        /* Fetch Busy Omni Channel Status Options */
        var action = component.get("c.getBusyPresenceStatus");       
                       
        action.setCallback(this, function(response){
            	var state = response.getState();
                if (component.isValid() && state === "SUCCESS"){
                    
                  component.set("v.omniBusyStatusList", response.getReturnValue());
                  
                  /*console.log(response.getReturnValue());*/
                }
                else {
                  console.log("Failed with state" + state);
                }
          })
          $A.enqueueAction(action);
    },
    
    refreshStatus : function(component, event, helper) {
        
        console.log('Running refresh workload');
        helper.fetchUserStatus(component);        
        helper.fetchCases(component);
        helper.getWorkload(component);
        	
    },
            
    setStatus : function(component, event, helper) {
        var omniAPI = component.find("omniToolkit");
        var selectedMenuItemValue = event.getParam("value");
        
        omniAPI.setServicePresenceStatus({
            statusId: selectedMenuItemValue.substring(0,15),
            callback: function(result) {
                if (result.success) { 
                    console.log('Set status successful');
                     
                } else {
                    console.log('Set status failed');
                }
            }
        });
    },
    
    logout: function(component, event, helper) {
        var omniAPI = component.find("omniToolkit");
        
        omniAPI.logout({
            callback: function(result) {
                if (result.success) {
                    console.log("Logout successful");
                } else {
                    console.log("Logout failed");
                }
            }
        });
    },
    
    showWorkToast : function(component, event, helper) {
    var showToast = component.get("v.toast");
    
        if (showToast == true) {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                type: 'success',
                mode: 'dismissable',
                message: 'New work was assigned to you! Check it out in the Omni-Channel Utility!',
                
            });
    		toastEvent.fire();
            
        } 
    
    },
    onWorkAccepted : function(component, event, helper) {
        var omniAPI = component.find("omniToolkit");
        console.log("Work accepted.");
        var workItemId = event.getParam('workItemId');
        var workId = event.getParam('workId');
        console.log(workItemId);
        console.log(workId);
        if(workItemId.substring(0,3) == '570'){
            //getServivePresenceStatusId()
            omniAPI.getServicePresenceStatusId().then(function(result) {
                console.log(result);
                var prevstat = result.statusId;
                component.set("v.lastStatus", prevstat);
        
        }).catch(function(error) {
            console.log('getStatus failed');
            //component.set("v.capacityPercent", 0 );
            //component.set("v.currentWorkload", 0 );
        });
        helper.setStatus(component);
    }},

        onWorkClosed : function(component,event,helper) {
                
            /* Get Current Workload */
            console.log("Work closed.");
        var workItemId = event.getParam('workItemId');
        if(workItemId.substring(0,3) != '570'){ return;}
        helper.setLastStatus(component);
        
            
        }
             //var action = component.get("c.updateOpportunityOwner");
     //action.setParams({ workItemId : workItemId });
     //action.setCallback(this,function(actionResult) {
         
     //});
     //$A.enqueueAction(action);
     //$A.get("e.force:refreshView").fire()
     

       
    

    
    
})