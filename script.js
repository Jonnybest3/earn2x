/* =====================================================
   EARN2X — WEBSITE JAVASCRIPT
   DEMO FRONT-END VERSION
   ===================================================== */

const state = {
  plan: "Free",
  limit: 0,
  reward: 0,
  done: 0,
  balance: 0
};


/* =====================================================
   HELPER
   ===================================================== */

const $ = (id) => document.getElementById(id);


function money(value) {
  return "₦" + Number(value).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}


/* =====================================================
   TOAST
   ===================================================== */

function toast(message) {
  const box = $("toast");

  if (!box) return;

  box.textContent = message;

  box.classList.add("show");

  clearTimeout(window.earn2xToast);

  window.earn2xToast = setTimeout(() => {
    box.classList.remove("show");
  }, 2500);
}


/* =====================================================
   RENDER DASHBOARD
   ===================================================== */

function render() {

  $("balance").textContent =
    money(state.balance);

  $("heroBalance").textContent =
    money(state.balance);

  $("points").textContent =
    state.balance.toLocaleString("en-NG") +
    " points";

  $("plan").textContent =
    state.plan;

  $("reward").textContent =
    money(state.reward);

  $("count").textContent =
    state.done + " / " + state.limit;


  $("status").textContent =
    state.plan === "Free"
      ? "INACTIVE"
      : state.plan.toUpperCase() + " ACTIVE";


  $("queue").textContent =
    state.plan === "Free"
      ? "Locked"
      : state.done >= state.limit
        ? "Limit reached"
        : "Active";


  $("progressText").textContent =
    money(state.balance) +
    " / ₦2,000";


  $("bar").style.width =
    Math.min(
      100,
      (state.balance / 2000) * 100
    ) + "%";


  renderTask();
}


/* =====================================================
   TASK QUEUE
   ===================================================== */

function renderTask() {

  const tasks = $("tasks");

  if (!tasks) return;


  if (state.plan === "Free") {

    tasks.innerHTML = `
      <div class="empty">
        <b>No active tasks</b>

        <p>
          Activate a demo workspace
          to load your task queue.
        </p>
      </div>
    `;

    return;
  }


  if (state.done >= state.limit) {

    tasks.innerHTML = `
      <div class="empty">

        <b>Daily demo limit reached</b>

        <p>
          Your selected demo allocation
          is complete.
        </p>

      </div>
    `;

    return;
  }


  const taskNumber =
    state.done + 1;


  tasks.innerHTML = `
    <div class="task">

      <div>
        <b>
          ${state.plan.toUpperCase()}
          • TASK ${taskNumber}
        </b>

        <span
          style="
            float:right;
            color:#18c88f;
            font-weight:800;
          "
        >
          +${money(state.reward)}
        </span>
      </div>


      <p>
        Complete this simulated task
        to test the task queue, wallet
        and progress system.
      </p>


      <button
        id="doTask"
        type="button"
      >
        Complete demo task
      </button>

    </div>
  `;


  const taskButton =
    $("doTask");

  if (taskButton) {
    taskButton.addEventListener(
      "click",
      completeTask
    );
  }
}


/* =====================================================
   COMPLETE TASK
   ===================================================== */

function completeTask() {

  const reference =
    prompt(
      "Demo task only — enter a short reference:"
    );


  if (
    !reference ||
    !reference.trim()
  ) {

    toast("Task cancelled.");

    return;
  }


  state.done += 1;

  state.balance += state.reward;


  render();


  toast(
    "Demo task completed successfully."
  );
}


/* =====================================================
   ACTIVATE PLAN
   ===================================================== */

function activatePlan(button) {

  if (!button) return;


  state.plan =
    button.dataset.plan || "Free";


  state.limit =
    Number(button.dataset.limit) || 0;


  state.reward =
    Number(button.dataset.reward) || 0;


  state.done = 0;

  state.balance = 0;


  render();


  const dashboard =
    $("dashboard");


  if (dashboard) {

    dashboard.scrollIntoView({
      behavior: "smooth"
    });

  }


  toast(
    state.plan +
    " demo workspace activated."
  );
}


/* =====================================================
   WITHDRAWAL VALIDATION
   ===================================================== */

function validateWithdrawal() {

  const account =
    $("acct").value.trim();


  const accountName =
    $("name").value.trim();


  const amount =
    Number($("amount").value);


  if (!/^\d{10}$/.test(account)) {

    toast(
      "Enter a valid 10-digit demo account number."
    );

    return;
  }


  if (!accountName) {

    toast(
      "Enter the account name."
    );

    return;
  }


  if (!amount || amount < 2000) {

    toast(
      "Minimum demo request is ₦2,000."
    );

    return;
  }


  if (amount > state.balance) {

    toast(
      "Amount exceeds the current demo balance."
    );

    return;
  }


  state.balance -= amount;


  render();


  toast(
    "Demo request validated. No money was transferred."
  );
}


/* =====================================================
   CHAT
   ===================================================== */

function sendChatMessage() {

  const input =
    $("chatInput");


  const message =
    input.value.trim();


  if (!message) {

    toast(
      "Write a message first."
    );

    return;
  }


  const item =
    document.createElement("div");


  const author =
    document.createElement("b");


  const text =
    document.createElement("span");


  author.textContent =
    "You";


  text.textContent =
    message;


  item.appendChild(author);

  item.appendChild(text);


  $("chat").appendChild(item);


  input.value = "";


  $("chat").scrollTop =
    $("chat").scrollHeight;
}


/* =====================================================
   SUPPORT TICKET
   ===================================================== */

function createTicket() {

  const message =
    $("ticket").value.trim();


  if (!message) {

    toast(
      "Describe your issue first."
    );

    return;
  }


  const ticketId =
    "E2X-" +
    Math.floor(
      100000 +
      Math.random() * 900000
    );


  $("result").textContent =
    "Demo ticket " +
    ticketId +
    " created successfully.";


  $("ticket").value = "";


  toast(
    "Support ticket created."
  );
}


/* =====================================================
   MOBILE MENU
   ===================================================== */

function toggleMenu() {

  const nav =
    $("nav");


  if (!nav) return;


  nav.classList.toggle("open");
}


/* =====================================================
   START WEBSITE
   ===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {


    /* PLAN BUTTONS */

    document
      .querySelectorAll(".activate")
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            activatePlan(button);

          }
        );

      });


    /* WITHDRAW BUTTON */

    const withdrawButton =
      $("withdraw");


    if (withdrawButton) {

      withdrawButton.addEventListener(
        "click",
        validateWithdrawal
      );

    }


    /* CHAT */

    const sendButton =
      $("send");


    if (sendButton) {

      sendButton.addEventListener(
        "click",
        sendChatMessage
      );

    }


    /* SUPPORT */

    const ticketButton =
      $("ticketBtn");


    if (ticketButton) {

      ticketButton.addEventListener(
        "click",
        createTicket
      );

    }


    /* MENU */

    const menuButton =
      $("menu");


    if (menuButton) {

      menuButton.addEventListener(
        "click",
        toggleMenu
      );

    }


    /* CLOSE MOBILE MENU
       WHEN A NAV LINK IS CLICKED */

    document
      .querySelectorAll("#nav a")
      .forEach(function (link) {

        link.addEventListener(
          "click",
          function () {

            const nav =
              $("nav");

            if (nav) {
              nav.classList.remove("open");
            }

          }
        );

      });


    /* INITIAL DISPLAY */

    render();

  }
);