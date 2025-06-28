import { User } from "./userTypes";

export enum ParticipantRole {

  // 🧑‍💼 ADMIN
  CREATOR = "creator",

  // 🔧 Technical Roles
  LEAD = "lead",
  DEVELOPER = "developer",
  FRONTEND_DEVELOPER = "frontend_developer",
  BACKEND_DEVELOPER = "backend_developer",
  FULLSTACK_DEVELOPER = "fullstack_developer",
  MOBILE_DEVELOPER = "mobile_developer",
  ARCHITECT = "architect",
  DEVOPS_ENGINEER = "devops_engineer",
  DATABASE_ADMINISTRATOR = "database_administrator",
  SECURITY_ENGINEER = "security_engineer",
  DATA_ENGINEER = "data_engineer",
  MACHINE_LEARNING_ENGINEER = "machine_learning_engineer",

  // 🎨 Design Roles
  DESIGNER = "designer",
  UI_DESIGNER = "ui_designer",
  UX_DESIGNER = "ux_designer",
  INTERACTION_DESIGNER = "interaction_designer",

  // 🧪 Quality & Testing Roles
  QA = "qa",
  TESTER = "tester",
  TEST_AUTOMATION_ENGINEER = "test_automation_engineer",
  COMPLIANCE_OFFICER = "compliance_officer",

  // 🧠 Product & Business Roles
  PRODUCT_OWNER = "product_owner",
  PRODUCT_MANAGER = "product_manager",
  BUSINESS_ANALYST = "business_analyst",
  STAKEHOLDER = "stakeholder",

  // 📊 Data & Analytics
  DATA_ANALYST = "data_analyst",
  DATA_SCIENTIST = "data_scientist",
  BI_DEVELOPER = "bi_developer",

  // 📋 Documentation & Support
  TECHNICAL_WRITER = "technical_writer",
  CUSTOMER_SUPPORT = "customer_support",
  TRAINER = "trainer",

  // 🧑‍💼 Leadership & Management
  MANAGER = "manager",
  SCRUM_MASTER = "scrum_master",
  MENTOR = "mentor",
  PROJECT_SPONSOR = "project_sponsor",
  PORTFOLIO_MANAGER = "portfolio_manager",
  CHANGE_MANAGER = "change_manager",

  // 📢 Marketing & Sales
  MARKETING_SPECIALIST = "marketing_specialist",
  SALES_ENGINEER = "sales_engineer",

  // 📚 Legal & Finance
  LEGAL_ADVISOR = "legal_advisor",
  FINANCIAL_ANALYST = "financial_analyst",

  // 🧑‍🎓 Entry-Level / External
  INTERN = "intern",
  TECHNICAL_ADVISOR = "technical_advisor",

  // 🌐 Other
  CUSTOM = "custom"
}


export interface Participant {
  id: string;
  userId: string;
  projectId: string;
  isLead: boolean;
  isTeamMember: boolean;
  role: ParticipantRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: Partial<User> | null;
}