import React, { useState } from 'react';

const LoanApplicationForm = ({ onSubmit, isLoading, onBulkSubmit }) => {

    const [formData, setFormData] = useState({
        borrower_name: "",
        loan_amnt: "",
        term: "36 months",
        int_rate: "",
        installment: "",
        grade: "A",
        sub_grade: "A1",
        emp_length: "< 1 year",
        home_ownership: "RENT",
        annual_inc: "",
        dti: "",
        delinq_2yrs: 0,
        pub_rec: 0,
        collections_12_mths_ex_med: 0,
        open_acc: "",
        total_acc: "",
        revol_bal: "",
        revol_util: ""
    });

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const csvText = event.target.result;
            const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
            
            if (lines.length < 2) {
                return alert("CSV file needs at least one header row and one data row.");
            }
            
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            
            // Handle Bulk Read
            const parsedRows = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
                if(values.length < headers.length) continue;
                
                const rowData = { ...formData };
                headers.forEach((header, index) => {
                    const val = values[index];
                    if (val !== undefined && header in rowData) {
                        if (!isNaN(val) && val !== "") {
                            rowData[header] = Number(val);
                        } else {
                            rowData[header] = val;
                        }
                    }
                });
                
                // Force Numeric Types for Safety 
                rowData.loan_amnt = Number(rowData.loan_amnt || 0);
                rowData.int_rate = Number(rowData.int_rate || 0);
                rowData.installment = Number(rowData.installment || 0);
                rowData.annual_inc = Number(rowData.annual_inc || 0);
                rowData.dti = Number(rowData.dti || 0);
                rowData.delinq_2yrs = Number(rowData.delinq_2yrs || 0);
                rowData.pub_rec = Number(rowData.pub_rec || 0);
                rowData.collections_12_mths_ex_med = Number(rowData.collections_12_mths_ex_med || 0);
                rowData.open_acc = Number(rowData.open_acc || 0);
                
                parsedRows.push(rowData);
            }
            
            if (parsedRows.length > 1 && onBulkSubmit) {
                // Bulk submit!
                onBulkSubmit(parsedRows);
            } else if (parsedRows.length === 1) {
                // Just set form data for 1
                setFormData(parsedRows[0]);
            }
            
            e.target.value = null; // Reset input so same file can be clicked again
        };
        reader.readAsText(file);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        const parsedValue =
            type === "number"
                ? value === "" ? "" : Number(value)
                : value;

        setFormData(prev => ({
            ...prev,
            [name]: parsedValue
        }));
    };

    const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedData = {
    ...formData,

    // Force numeric fields
    loan_amnt: Number(formData.loan_amnt || 0),
    int_rate: Number(formData.int_rate || 0),
    installment: Number(formData.installment || 0),
    annual_inc: Number(formData.annual_inc || 0),
    dti: Number(formData.dti || 0),

    delinq_2yrs: Number(formData.delinq_2yrs || 0),
    pub_rec: Number(formData.pub_rec || 0),
    collections_12_mths_ex_med: Number(formData.collections_12_mths_ex_med || 0),
    open_acc: Number(formData.open_acc || 0),
};
console.log("Sending to backend:", cleanedData);
    onSubmit(cleanedData);
};

    return (
        <form onSubmit={handleSubmit} className="bg-card-light dark:bg-card-dark p-8 rounded-[2rem] shadow-lg border border-slate-200 dark:border-neutral-800">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="material-icons-round text-primary">person_add</span>
                    New Applicant Profile
                </h3>

                <div className="relative">
                    <input 
                        type="file" 
                        accept=".csv" 
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Upload CSV Data"
                    />
                    <button type="button" className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-sm font-semibold rounded-lg transition-colors dark:text-white whitespace-nowrap">
                        <span className="material-icons-round text-sm">upload_file</span>
                        Auto-Fill from CSV
                    </button>
                </div>
            </div>

            {/* Applicant Name */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Applicant Full Name
                </label>

                <input
                    type="text"
                    name="borrower_name"
                    value={formData.borrower_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. John Smith"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                {/* Loan Details */}
                <div className="space-y-4">

                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-neutral-800 pb-2">
                        Requested Loan
                    </h4>
                    
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Loan Amount ($)</label>
                        <input
                            type="number"
                            name="loan_amnt"
                            placeholder="e.g. 15000"
                            value={formData.loan_amnt}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Interest Rate (%)</label>
                        <input
                            type="number"
                            name="int_rate"
                            placeholder="e.g. 5.5"
                            value={formData.int_rate}
                            onChange={handleChange}
                            required
                            step="0.1"
                            max="100"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Monthly Installment ($)</label>
                        <input
                            type="number"
                            name="installment"
                            placeholder="e.g. 450"
                            value={formData.installment}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Loan Term</label>
                        <select
                            name="term"
                            value={formData.term}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                        >
                            <option value="36 months">36 Months</option>
                            <option value="60 months">60 Months</option>
                        </select>
                    </div>

                </div>

                {/* Borrower Financials */}
                <div className="space-y-4">

                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-neutral-800 pb-2">
                        Borrower Stats
                    </h4>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Annual Income ($)</label>
                        <input
                            type="number"
                            name="annual_inc"
                            placeholder="e.g. 100000"
                            value={formData.annual_inc}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Debt To Income (%)</label>
                        <input
                            type="number"
                            name="dti"
                            placeholder="e.g. 12.5"
                            value={formData.dti}
                            onChange={handleChange}
                            step="0.1"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Home Ownership</label>
                        <select
                            name="home_ownership"
                            value={formData.home_ownership}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                        >
                            <option value="RENT">Rent</option>
                            <option value="MORTGAGE">Mortgage</option>
                            <option value="OWN">Own</option>
                        </select>
                    </div>

                </div>

                {/* Credit History */}
                <div className="space-y-4">

                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-neutral-800 pb-2">
                        Credit File
                    </h4>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Delinquencies (Last 2 Years)</label>
                        <input
                            type="number"
                            name="delinq_2yrs"
                            value={formData.delinq_2yrs}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Public Records</label>
                        <input
                            type="number"
                            name="pub_rec"
                            value={formData.pub_rec}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Collections (Last 12 Months)</label>
                        <input
                            type="number"
                            name="collections_12_mths_ex_med"
                            value={formData.collections_12_mths_ex_med}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Open Credit Accounts</label>
                        <input
                            type="number"
                            name="open_acc"
                            value={formData.open_acc}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                        />
                    </div>

                </div>

            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2
                ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-green-600 shadow-primary/20 hover:shadow-primary/40'}`}
            >

                {isLoading ? (
                    <>
                        <span className="material-icons-round animate-spin">refresh</span>
                        Analyzing Risk...
                    </>
                ) : (
                    <>
                        <span className="material-icons-round">psychology</span>
                        Run AI Assessment
                    </>
                )}

            </button>

        </form>
    );
};

export default LoanApplicationForm;