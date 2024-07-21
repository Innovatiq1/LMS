import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { LikertChartComponent } from './likert-chart/likert-chart.component';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { CreateLikertChartComponent } from './create-likert-chart/create-likert-chart.component';
// import { CreateFeedbackComponent } from './create-feedback/create-feedback.component';
import { FeedbackViewComponent } from './feedback-view/feedback-view.component';

const routes: Routes = [
  {
    path:"feedbacks-list",
    component: SurveyListComponent
  },
  {
    path:"survey-list",
    component: LikertChartComponent
  },

  {
    path:"view-survey",
    component: CreateSurveyComponent
  },
  {
    path:"feedbacks-list/view-survey",
    component: CreateSurveyComponent
  },

  {
    path:"create-survey-questions",
    component: CreateLikertChartComponent
  },
  {
    path:"edit-survey-questions/:id",
    component: CreateLikertChartComponent
  },
  // {
  //   path:"create-feedback",
  //   component: CreateFeedbackComponent
  // },
  // {
  //   path:"edit-feedback/:id",
  //   component: CreateFeedbackComponent
  // },
  {
    path:"view-feedback/:id",
    component: FeedbackViewComponent
  },
  {
    path:"survey-list/view-feedback/:id",
    component: FeedbackViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }
