from rest_framework import serializers
from .models import HundiSession, HundiCollection, HundiWitness

class HundiWitnessSerializer(serializers.ModelSerializer):
    class Meta:
        model = HundiWitness
        fields = ["id", "name", "role"]

class HundiCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HundiCollection
        fields = ["id", "denomination", "count", "amount"]

class HundiSessionSerializer(serializers.ModelSerializer):
    witnesses = HundiWitnessSerializer(many=True, required=False)
    collections = HundiCollectionSerializer(many=True, read_only=True)
    
    # Non-model field for inputting denominations
    denominations = serializers.DictField(child=serializers.IntegerField(), write_only=True, required=False)
    witness_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    class Meta:
        model = HundiSession
        fields = "__all__"

    def create(self, validated_data):
        denominations = validated_data.pop("denominations", {})
        witness_names = validated_data.pop("witness_names", [])
        
        # Pull witnesses from standard field if witness_names is missing
        if not witness_names and "witnesses" in validated_data:
            witness_data = validated_data.pop("witnesses")
            witness_names = [w.get("name") for w in witness_data if w.get("name")]

        session = HundiSession.objects.create(**validated_data)

        # Create denominations
        for denom, count in denominations.items():
            if int(count) > 0:
                HundiCollection.objects.create(
                    session=session,
                    denomination=int(denom),
                    count=int(count)
                )

        # Create witnesses
        for name in witness_names:
            HundiWitness.objects.create(
                session=session,
                organization=session.organization,
                name=name
            )

        return session
