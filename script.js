// EARN2X ENTERPRISE LOGIC ENGINE
var activePlanName = "Free"; var activePlanCapLimit = 0; var activeTaskRewardAmt = 0;
var runningUserWalletBalanceNgn = 0; var completedCountTrackerToday = 0;
var totalBusinessSalesGross = 0; var totalTaskRewardsPaidOutSum = 0;
var localCeoWithdrawalsQueue = []; var localCeoComplaintsLogs = [];

window.onload = function() {
    switchSection('home');
};

function switchSection(id) {
    var sections = ['home', 'dashboard', 'wallet', 'plans', 'admin'];
    for(var i=0; i<sections.length; i++) {
        var el = document.getElementById('view-' + sections[i]);
        var btn = document.getElementById('btn-tab-' + sections[i]);
        if(el) el.style.display = 'none';
        if(btn) btn.className = 'nav-item';
    }
    var targetView = document.getElementById('view-' + id);
    var targetBtn = document.getElementById('btn-tab-' + id);
    if(targetView) targetView.style.display = 'block';
    if(targetBtn) targetBtn.className = 'nav-item active';

    if(id === 'dashboard') renderDashboardTasks();
    if(id === 'wallet') renderWalletComponent();
    if(id === 'admin') renderAdminComponent();
}

function payWithPaystack(planName, feeAmount, dailyLimitCap, rewardPerTask) {
    var livePublicKey = 'pk_live_b1c853421041f335e1eca5'; 
    var handler = PaystackPop.setup({
        key: livePublicKey, email: 'johnunoh555@gmail.com', amount: feeAmount * 100, currency: 'NGN',
        ref: 'E2X-' + Math.floor((Math.random() * 1000000000) + 1),
        callback: function(response) {
            alert('💳 SECURITY FEE RECEIVED!\n₦' + feeAmount.toLocaleString() + ' logged.');
            activePlanName = planName; activePlanCapLimit = dailyLimitCap; activeTaskRewardAmt = rewardPerTask; completedCountTrackerToday = 0;
            totalBusinessSalesGross += feeAmount; syncGlobalBusinessControlBoardUI(); triggerContinuousTaskRegeneration();
        }
    });
    handler.openIframe();
}

function triggerContinuousTaskRegeneration() {
    var poolBox = document.getElementById('dynamic-tasks-pool-box');
    if(completedCountTrackerToday >= activePlanCapLimit) {
        poolBox.innerHTML = '<p style="color:#10b981; font-weight:bold; font-size:12px; text-align:center; padding:12px; border:1px dashed #10b981; border-radius:8px;">🎉 Daily Limit Reached! All ' + activePlanCapLimit + ' task slots cleared. Looping regeneration returns tomorrow morning!</p>';
        return;
    }
    var visibleIndexNumber = completedCountTrackerToday + 1;
    poolBox.innerHTML = '<div class="task-card-item"><div style="display: flex; justify-content: space-between; font-weight: bold;"><span>🎮 [' + activePlanName.toUpperCase() + ' TASK #' + visibleIndexNumber + '] Loop Node</span><span style="color:#10b981;">+' + activeTaskRewardAmt + ' Points (₦' + activeTaskRewardAmt + ')</span></div><p style="margin:4px 0 8px 0; color:#94a3b8; font-size:11px;">Fulfill digital validation requirements for object slot #' + visibleIndexNumber + '. Tasks regenerate immediately upon execution clicks.</p><button type="button" class="gradient-border-btn" style="margin:0; padding:6px 12px; font-size:11px; width:auto; float:right;" onclick="executeEarningClick(' + activeTaskRewardAmt + ')">[ START TASK ]</button><div style="clear:both;"></div></div>';
    document.getElementById('lbl-days-left').innerHTML = "⏳ Membership Access Status: Active | Expiration countdown: 72 Days Left (3 Months Block)";
    document.getElementById('lbl-active-plan').innerHTML = activePlanName.toUpperCase() + " TIER PASS ACTIVE";
    document.getElementById('txt-user-cap').innerHTML = completedCountTrackerToday + " / " + activePlanCapLimit + " Tasks";
}

function executeEarningClick(pointsValue) {
    var trackingProofValue = prompt("Provide proof verification link:");
    if(!trackingProofValue) return alert("Aborted: Proof parameter cannot be blank.");
    runningUserWalletBalanceNgn += pointsValue; completedCountTrackerToday += 1; totalTaskRewardsPaidOutSum += pointsValue;
    document.getElementById('txt-user-bal').innerHTML = "₦" + runningUserWalletBalanceNgn.toLocaleString();
    document.getElementById('txt-user-pts').innerHTML = runningUserWalletBalanceNgn.toLocaleString() + " Points";
    var currentMinimumThresholdValue = 2000; var deficitLeftToCashoutValue = Math.max(0, currentMinimumThresholdValue - runningUserWalletBalanceNgn);
    document.getElementById('txt-user-remaining').innerHTML = "₦" + runningUserWalletBalanceNgn.toLocaleString() + " / ₦2,000 (₦" + deficitLeftToCashoutValue.toLocaleString() + " Left)";
    document.getElementById('bar-user-fill').style.width = Math.min(100, (runningUserWalletBalanceNgn / currentMinimumThresholdValue) * 100) + "%";
    alert("✅ TASK COMPLETED! Points released. Spawning next regenerated objective...");
    syncGlobalBusinessControlBoardUI(); triggerContinuousTaskRegeneration();
}

function submitUserWithdrawalRequest() {
    var bName = document.getElementById('bank-name').value; var bAcct = document.getElementById('bank-acct').value; var bTitle = document.getElementById('bank-title').value; var amtVal = parseFloat(document.getElementById('bank-amount').value);
    if(!amtVal || amtVal < 2000) return alert("Aborted: Minimum targets ₦2,000.");
    if(amtVal > 30000000) return alert("Aborted: Maximum cannot exceed ₦30,000,000.");
    if(amtVal > runningUserWalletBalanceNgn) return alert("Aborted: Amount crosses available balance.");
    runningUserWalletBalanceNgn -= amtVal; document.getElementById('txt-user-bal').innerHTML = "₦" + runningUserWalletBalanceNgn.toLocaleString();
    var uniqueWdId = "WD-" + Math.floor((Math.random() * 100000) + 1); localCeoWithdrawalsQueue.push({ id: uniqueWdId, bank: bName, account: bAcct, name: bTitle, amount: amtVal });
    alert("SUCCESS! Withdrawal request logged into Escrow clearance tracking node.");
    document.getElementById('bank-amount').value = ""; renderCeoAdminQueues();
}

function postCommunityChatMessage() {
    var txt = document.getElementById('chat-input-text').value; if(!txt) return;
    var chatBox = document.getElementById('chat-messages-box'); chatBox.innerHTML += '<div class="chat-bubble"><b style="color:#10b981;">You:</b> ' + txt + '</div>';
    document.getElementById('chat-input-text').value = ""; chatBox.scrollTop = chatBox.scrollHeight;
}

function submitSupportComplaintTicket() {
    var msg = document.getElementById('support-complaint-msg').value; if(!msg) return alert("Complaint box cannot remain empty.");
    var uniqueTicketId = "TKT-" + Math.floor((Math.random() * 100000) + 1); localCeoComplaintsLogs.push({ id: uniqueTicketId, text: msg, user: 'johnunoh555@gmail.com' });
    alert("SUCCESS! Filed onto the support administrator desk.");
    document.getElementById('support-complaint-msg').value = ""; renderCeoAdminQueues();
}

function renderCeoAdminQueues() {
    var wdContainer = document.getElementById('ceo-withdrawal-approval-list-queue');
    if(localCeoWithdrawalsQueue.length === 0) { wdContainer.innerHTML = '<p style="color:#64748b; font-style:italic; padding:6px; text-align:center;">No pending bank withdrawal requests.</p>'; }
    else {
        var wdContent = "";
        for(var i=0; i<localCeoWithdrawalsQueue.length; i++) { var w = localCeoWithdrawalsQueue[i]; wdContent += '<div style="background:#111827; border:1px solid #10b981; padding:10px; border-radius:8px; margin-bottom:8px;"><p style="margin:0; font-weight:bold; color:white;">Cashout Request: ₦' + w.amount.toLocaleString() + '</p><p style="margin:2px 0; color:#94a3b8; font-size:10px;">Bank: ' + w.bank + ' | Account: ' + w.account + ' | Name: ' + w.name + '</p><button type="button" class="gradient-border-btn" style="background:#10b981; font-size:11px; padding:6px; margin-top:6px;" onclick="ceoApproveBankPayoutClick(\'' + w.id + '\', ' + w.amount + ')">Approve Payout Clearance</button></div>'; }
        wdContainer.innerHTML = wdContent;
    }
    var cmpContainer = document.getElementById('ceo-complaints-feed-box');
    if(localCeoComplaintsLogs.length === 0) { cmpContainer.innerHTML = '<p style="color:#64748b; font-style:italic; padding:6px; text-align:center;">No active user helpdesk tickets.</p>'; }
    else {
        var cmpContent = "";
        for(var j=0; j<localCeoComplaintsLogs.length; j++) { var c = localCeoComplaintsLogs[j]; cmpContent += '<div class="support-ticket"><p style="margin:0; font-weight:bold; color:#06b6d4;">Ticket ID: ' + c.id + ' | From: ' + c.user + '</p><p style="margin:4px 0; color:#cbd5e1; background:#0b0f19; padding:6px; border-radius:4px; font-style:italic;">"' + c.text + '"</p><button type="button" class="gradient-border-btn" style="background:#334155; font-size:10px; padding:4px 10px; margin-top:2px;" onclick="ceoResolveTicketClick(\'' + c.id + '\')">Mark Ticket Resolved</button></div>'; }
        cmpContainer.innerHTML = cmpContent;
    }
}

window.ceoApproveBankPayoutClick = function(id, amt) {
    var freshQueue = []; for(var i=0; i<localCeoWithdrawalsQueue.length; i++) { if(localCeoWithdrawalsQueue[i].id !== id) freshQueue.push(localCeoWithdrawalsQueue[i]); } localCeoWithdrawalsQueue = freshQueue;
    alert("🔥 CASH CLEARANCE DISPATCHED!\n₦" + amt.toLocaleString() + " approved and wired."); renderCeoAdminQueues();
};

window.ceoResolveTicketClick = function(id) {
    var freshLogs = []; for(var i=0; i<localCeoComplaintsLogs.length; i++) { if(localCeoComplaintsLogs[i].id !== id) freshLogs.push(localCeoComplaintsLogs[i]); } localCeoComplaintsLogs = freshLogs;
    alert("Ticket marked closed."); renderCeoAdminQueues();
};

function syncGlobalBusinessControlBoardUI() {
    document.getElementById('adm-sales').innerHTML = "₦" + totalBusinessSalesGross.toLocaleString();
    document.getElementById('adm-payouts').innerHTML = "₦" + totalTaskRewardsPaidOutSum.toLocaleString();
    var platformProfitNetDelta = totalBusinessSalesGross - totalTaskRewardsPaidOutSum;
