from . import models
from rest_framework import serializers



class AdminSerializer(serializers.ModelSerializer):

    class Meta:

        model = models.Admin
        fields = '__all__'

class ManagerSerializer(serializers.ModelSerializer):

    class Meta:

        model = models.Manager
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):

    manager = ManagerSerializer()

    class Meta:

        model = models.Employee
        fields = '__all__'

class AddEmployeeSerializer(serializers.ModelSerializer):

    class Meta:

        model = models.Employee
        fields = '__all__'

class AccomodationSerializer(serializers.ModelSerializer):

    class Meta:

        model = models.Accomodation
        fields = '__all__'

class RequestSerializerEmployee(serializers.ModelSerializer):
    manager = ManagerSerializer()
    class Meta:
        model = models.TravelRequest
        fields = ['from_location','to_location','date_submitted','departure_date','status','return_date','purpose','id','manager']

class RequestSerializerManager(serializers.ModelSerializer):
    employee = EmployeeSerializer()
    class Meta:
        model = models.TravelRequest
        fields = ['from_location','to_location','date_submitted','departure_date','status','employee']

class RequestSerializerAdmin(serializers.ModelSerializer):
    employee = EmployeeSerializer()
    manager = ManagerSerializer()

    class Meta:
        model = models.TravelRequest
        fields = ['from_location','to_location','date_submitted','departure_date','status','employee','manager']

class TravelSerializer(serializers.ModelSerializer):

    employee = EmployeeSerializer()
    manager = ManagerSerializer()

    class Meta:

        model = models.TravelRequest
        fields = '__all__'

class NewTravelSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.TravelRequest
        fields = '__all__'

    def create(self, validated_data):
        # Extract from context (which was passed from the view)
        employee = self.context.get('employee')
        manager = self.context.get('manager')

        if not employee or not manager:
            raise serializers.ValidationError("Employee and Manager are required")

        # Add them to the validated data before saving
        validated_data['employee'] = employee
        validated_data['manager'] = manager

        return models.TravelRequest.objects.create(**validated_data)