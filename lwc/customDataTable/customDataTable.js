import { LightningElement, track } from 'lwc';
import searchAccounts from '@salesforce/apex/AccountSearchController.searchAccounts';
import deleteRecord from '@salesforce/apex/AccountSearchController.deleteRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class customDataTable extends NavigationMixin(LightningElement) {
    @track searchKey = '';
    @track accounts;

    handleChange(event) {
        this.searchKey = event.target.value;
    }

    handleSearch() {
        searchAccounts({ searchKey: this.searchKey })
            .then(result => {
                this.accounts = result;
                if(this.accounts == 0){
                    this.showToast('Error','so such related contact or opportunity result found', 'error');
                }
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    handleView(event) {
        const recordId = event.currentTarget.dataset.id;
        const sObject = event.currentTarget.dataset.sobject;

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: sObject,
                actionName: 'view'
            }
        });
    }

    handleEdit(event) {
        const recordId = event.currentTarget.dataset.id;
        const sObject = event.currentTarget.dataset.sobject;

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: sObject,
                actionName: 'edit'
            }
        });
    }

    handleDelete(event) {
        const recordId = event.currentTarget.dataset.id;
        const sObject = event.currentTarget.dataset.sobject;

        deleteRecord({ recordId: recordId, sObjectName: sObject })
            .then(() => {
                this.showToast('Success', `${sObject} record deleted`, 'success');
                this.handleSearch(); // refresh search results
            })
            .catch(error => {
                this.showToast('Error deleting record', error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        }));
    }
}