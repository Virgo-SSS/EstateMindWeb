<?php

namespace Tests\Feature\Predictions;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class PredictionTest extends TestCase
{
    public function test_user_can_see_prediction_page(): void
    {
        $response = $this->get(route('prediction.index'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Predictions/Prediction')
        );
    }
}
