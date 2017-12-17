
describe('Controller: MenuController', function () {

  // load the controller's module
  beforeEach(module('measureLifeApp'));

  var MenuController,
    scope, $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$httpBackend_,  $rootScope, menuFactory) {
          // place here mocked dependencies
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET("http://localhost:3000/goals?featured=true").respond([
        {
                "_id": "5a2a1458ed14b6911e570ac3",
                "updatedAt": "2017-12-08T04:26:00.319Z",
                "createdAt": "2017-12-08T04:26:00.319Z",
                "name": "STAY OFFLINE ONE DAY PER WEEK",
                "description": "Take one day of the week (I chose Saturday) to stay completely offline and away from your computer.",
                "category": "Mind",
                "__v": 0,
                "featured": true
            },
            {
                "_id": "5a2a1b22ed14b6911e570ace",
                "updatedAt": "2017-12-08T04:54:58.010Z",
                "createdAt": "2017-12-08T04:54:58.010Z",
                "name": "WALK AFTER LUNCH OR DINNER",
                "description": "Going for a walk after dinner was probably one of my favorite goals that I set for myself. It really helps to reset your brain, let your food digest, and get a nice healthy dose of fresh air before returning back to your desk or couch.",
                "category": "Body",
                "__v": 0,
                "featured": true
            },
            {
                "_id": "5a2a1b8ded14b6911e570ad8",
                "updatedAt": "2017-12-08T04:56:45.737Z",
                "createdAt": "2017-12-08T04:56:45.737Z",
                "name": "GO TO BED AT A REASONABLE TIME",
                "description": "Make sleep a priority by creating your own night routine using this post and sticking to it for a whole month. Going to bed early doesn’t make you a grandma, okay? Give yourself permission to rest.",
                "category": "Soul",
                "__v": 0,
                "featured": true
            }
      ]);

    scope = $rootScope.$new();
    GoalsController = $controller('GoalsController', {
      $scope: scope, goalsFactory: goalsFactory
    });


  }));

  it('should have showDetails as false', function () {
    expect(scope.showDetails).toBe(false);
  });


});
