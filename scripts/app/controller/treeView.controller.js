
angular.module('betterTimetable')
.controller('TreeViewCtrl', function ($scope, RootCategoriesRsc, SubcategoriesRsc) {

    $scope.root; 

    RootCategoriesRsc.query().$promise
        .then(function(root) {
            $scope.root = root;
        })
        .then(() => {
            
            for (var i = 0; i < $scope.root.length; i++) {
            
                var idRootCategory = $scope.root[i]['id']; 
                $scope.root[i].collapsed = true; 
                query(idRootCategory, $scope.root); 
            }
        })
        .catch(console.error); 
    
        selectedNode(); 


    function selectedNode() {
        $scope.$watch( 'timetable.currentNode', function( newObj, oldObj ) {
            if( $scope.timetable && angular.isObject($scope.timetable.currentNode) ) {
                getSelectedNodeId($scope.timetable.currentNode.id); 
            }
        }, false);
    }

    function getSelectedNodeId(id)
    {
        console.log( 'Node Selected!!' );
        console.log("id of node" + id); 
    }


    function query(id, tree){
    
        SubcategoriesRsc.query({id: id}).$promise
        .then(function(result) {  

            if(result.length > 0){
                let position = findPositionOfId(id, tree); 

                if(position !== -1)
                {
                    tree[position].collapsed = true; 
                    tree[position].children = result;

                    for (let i = 0; i < result.length; i++){
                         
                        for (let i = 0; i < result.length; i++){
                            return query(result[i]['id'], tree[i].children); 
                        }                  
                    }
                }
            }
        })
    }

    function findPositionOfId(id, tree){
        return tree.map(function(x) {return x.id; }).indexOf(id);
    }

})
.directive("treeView", function() {
    return {
        templateUrl: 'views/treeView.html',
        controller: "TreeViewCtrl"
    };
});